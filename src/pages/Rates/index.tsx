import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "../../redux/hook";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import styles from "./index.module.css";

interface currenciesValue {
    [index: string]: number;
}

const Rates: React.FC = (props) => {
    const openDate = useSelector(({ openDate }) => openDate.openDate);
    const currencies = useSelector(({ currency }) => currency.data);

    const [base, setBase] = useState<string>("usd");
    const [currentValue, setCurrentValue] = useState<currenciesValue[]>([]);
    const [openValue, setOpenValue] = useState<currenciesValue[]>([]);

    const getRate = (date: string = "latest") => {
        return axios.get(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${base}.min.json`
        );
    }

    useEffect(() => {
        getRate().then(({ data }) => {
            setCurrentValue(data[base])
            return getRate(openDate)
        }).then(({ data }) => {
            setOpenValue(data[base])
        }).catch((e) => {
            console.log(e)
        })
    }, [base])

    interface Record {
        currency: string,
        name: string,
        exchange_rate: number | null,
        trend: number | null,
    }

    const createData = (currency: string): Record => {
        return {
            currency: currency,
            name: currencies[currency],
            exchange_rate: currentValue[currency] || null,
            trend: (currentValue[currency] && openValue[currency]) ? (currentValue[currency] - openValue[currency]) * 100 / openValue[currency] : null
        }
    }

    const createRows = () => {
        let rows: Record[] = []
        for (let key in currencies) {
            rows.push(createData(key))
        }
        return rows
    }
    const rows = createRows();

    return (
        <TableContainer component={Paper}>
            <Typography component="p">
                Based on usd
            </Typography>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Currency</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Exchange Rate</TableCell>
                        <TableCell>Trend</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.currency}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.currency}
                            </TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.exchange_rate}</TableCell>
                            <TableCell>
                                <span className={row.trend && row.trend > 0 ? styles["increased"] : row.trend && row.trend < 0 ? styles["decreased"] : ""}>{(row.trend && row.trend > 0 ? "+" : "") + row.trend + (row.trend ? "%" : "")}</span>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Rates;


