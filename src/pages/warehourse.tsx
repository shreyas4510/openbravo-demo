import { createColumnHelper } from "@tanstack/react-table";
import Table from "../component/table";
import { useEffect, useState } from "react";
import Loader from "../component/loader";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { IoDocumentText } from "react-icons/io5";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { json2csv } from 'json-2-csv';
import { saveAs } from 'file-saver';

interface DataType {
    totalRows: number;
    data: Record<string, string | number>[];
    totalData: Record<string, string | number>[];
}

export default function Warehouse() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DataType>({
        totalRows: 0,
        data: [],
        totalData: []
    });

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [sorting, setSorting] = useState<Record<string, string | boolean>[]>([]);
    const [filtering, setFiltering] = useState({});
    const [modalData, setModalData] = useState<null | Record<string, string | number>>(null);

    useState(() => {
        (async () => {
            try {
                const url = '/openbravo/org.openbravo.service.json.jsonrest/rdsm_advstock_v?_where=qtyonhand%3E0&_selectedProperties=organization,upc,product,qtyonhand,uom,popendingqty';
                const { data } = await axios.get(url, {
                    auth: {
                        username: process.env.REACT_APP_USERNAME as string,
                        password: process.env.REACT_APP_PASSWORD as string
                    }
                })

                const res = data.response;
                const obj = {
                    data: [...res.data].slice(
                        pagination.pageIndex * pagination.pageSize,
                        (pagination.pageIndex * pagination.pageSize) + pagination.pageSize
                    ),
                    totalRows: res.totalRows,
                    totalData: res.data
                };
                setData(obj)
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                toast.error('Failed to fetch warehouse data');
            }
        })()
        // @ts-ignore
    }, [])

    useEffect(() => {
        const sort: any = sorting[0];
        if (sort) {
            const tempData = [...data.totalData];
            let sortedData = tempData;

            if (sort.desc) {
                if (typeof sortedData[0][sort.id] === 'string') {
                    sortedData.sort((a: any, b: any) => b[sort.id].localeCompare(a[sort.id]));
                }

                if (typeof sortedData[0][sort.id] === 'number') {
                    sortedData.sort((a: any, b: any) => b[sort.id] - a[sort.id]);
                }
            } else {
                if (typeof sortedData[0][sort.id] === 'string') {
                    sortedData.sort((a: any, b: any) => a[sort.id].localeCompare(b[sort.id]));
                }

                if (typeof sortedData[0][sort.id] === 'number') {
                    sortedData.sort((a: any, b: any) => a[sort.id] - b[sort.id]);
                }
            }

            setData((prev => ({
                ...prev,
                data: sortedData.slice(
                    pagination.pageSize * pagination.pageIndex,
                    (pagination.pageSize * pagination.pageIndex) + pagination.pageSize
                )
            })))
        }
    }, [sorting[0]?.id, sorting[0]?.desc])

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            data: prev.totalData.slice(
                pagination.pageSize * pagination.pageIndex,
                (pagination.pageSize * pagination.pageIndex) + pagination.pageSize
            )
        }));
    }, [pagination.pageIndex, pagination.pageSize])

    const onPaginationChange = (e: any) => {
        setPagination(e);
    };

    const onSortingChange = (e: any) => {
        const sortDetails = e()[0];
        const data = [...sorting][0];

        if (!data || data.id !== sortDetails.id) {
            setSorting([{ id: sortDetails.id, desc: false }]);
            return;
        }
        setSorting([{ ...data, desc: !data.desc }]);
    };

    const onFilterChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setData((prev) => ({
            ...prev,
            data: prev.totalData.filter((item: any) => {
                if (name === 'recordTime') {
                    return String(
                        moment(item[name]).format('DD-MM-YYYY')
                    ).toLowerCase().includes(value.toLowerCase())
                } else {
                    return String(item[name]).toLowerCase().includes(value.toLowerCase());
                }
            }).slice(
                pagination.pageSize * pagination.pageIndex,
                (pagination.pageSize * pagination.pageIndex) + pagination.pageSize
            )
        }))

        setFiltering({
            field: name,
            value
        });
    };

    const handleExport = () => {
        const csvData = json2csv(data.totalData)
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'data.csv');
    };

    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.display({
            id: 'product$_identifier',
            header: 'Product Identifier',
            minSize: 200,
            cell: ({ row }: any) => {
                return row?.original?.['product$_identifier']
            }
        }),
        columnHelper.display({
            id: 'upc',
            header: 'Upc',
            minSize: 200,
            cell: ({ row }: any) => <div>{row?.original?.upc}</div>
        }),
        columnHelper.display({
            id: 'uom$_identifier',
            header: 'UOM Identifier',
            minSize: 200,
            cell: ({ row }: any) => <div>{row?.original?.['uom$_identifier']}</div>
        }),
        columnHelper.display({
            id: 'qtyonhand',
            header: 'Quantity',
            minSize: 200,
            cell: ({ row }: any) => <div>{row?.original?.['qtyonhand']}</div>
        }),
        columnHelper.display({
            id: 'recordTime',
            header: 'Record Time',
            minSize: 200,
            cell: ({ row }: any) => <div>{
                row.original?.['recordTime'] ? moment(row.original?.['recordTime']).format('DD-MM-YYYY') : <></>
            }</div>
        }),
        columnHelper.display({
            id: 'view',
            header: 'View',
            minSize: 200,
            enableFiltering: 'FALSE',
            // @ts-ignore
            enableSorting: 'FALSE',
            cell: ({ row }: any) => {
                return row?.original?.product ? (
                    <div onClick={() => { setModalData(row?.original) }}>
                        <IoDocumentText role="button" size={25} />
                    </div>
                ) : <></>
            }
        }),
    ];

    const handleClose = () => {
        setModalData(null);
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="d-flex flex-column my-4 px-2">
            <button
                disabled={!data.totalRows}
                className="custom-button ms-auto me-5 px-4 py-2 rounded text-white mb-2"
                onClick={handleExport}
            >Export</button>
            <Table
                data={data.data}
                columns={columns}
                count={data.totalRows}
                onPaginationChange={onPaginationChange}
                pagination={pagination}
                sorting={sorting}
                onSortingChange={onSortingChange}
                filtering={filtering}
                onFilterChange={onFilterChange}
            />
            <Modal size="xl" show={Boolean(modalData)} onHide={handleClose}>
                <Modal.Header closeButton><Modal.Title>Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Row>
                        {
                            Object.keys(
                                modalData as Record<string, string | number> || {}
                            ).map((key) => {
                                return (
                                    <Col className="col-12 col-md-4 my-3">
                                        <h6 className="fw-bold">{key}</h6>
                                        <p>{modalData?.[key]}</p>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="border-0 custom-button" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}