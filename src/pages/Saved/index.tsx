import React, { useState } from "react";
import { useSelector } from "../../redux/hook";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./index.module.css";
import axios from "axios";

const Saved: React.FC = (props) => {
    const [time, setTime] = useState("")
    const [amount, setAmount] = useState("")
    const [convertedAmount, setConvertedAmount] = useState(NaN)
    const [validAmount, setValidAmount] = useState(false)
    const [showCard, setShowCard] = useState(false)
    const [fromCurrency, setFromCurrency] = useState("usd")
    const [toCurrency, setToCurrency] = useState("aud")
    const currencies = useSelector(({ currency }) => currency.data);
    interface currencyType {
        currency: string, name: string
    }
    const items = () => {
        let lists: currencyType[] = []
        for (let key in currencies) {
            lists.push({ currency: key, name: currencies[key] })
        }
        return lists
    }
    const menuItems = items()

    const handleAmountChange = (e) => {
        if (e.target.value.trim() === "") {
            setValidAmount(false)
            setShowCard(false)
        } else if (!isNaN(Number(e.target.value))) {
            setValidAmount(true)
        }
        else {
            setValidAmount(false)
            setShowCard(false)
        }
        setAmount(e.target.value)
    }

    const handleFromChange = (e: SelectChangeEvent) => {
        setFromCurrency(e.target.value)
    }

    const handleToChange = (e: SelectChangeEvent) => {
        setToCurrency(e.target.value)
    }

    const card = (
        <React.Fragment>
            <Card className={styles["card"]} variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {time}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`}
                    </Typography>
                </CardContent>
            </Card>
        </React.Fragment>
    )
    const convert = () => {
        if (!validAmount) {
            return
        } else {
            axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.json`)
                .then(({ data }) => {
                    setTime(data.date)
                    setConvertedAmount(data[toCurrency] * Number(amount))
                    setShowCard(true)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    return (
        <div className={styles["container"]}>
            <Box className={styles["box"]}
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    className={styles["amount"]}
                    error={!validAmount}
                    id="amount"
                    label="Amount"
                    onChange={handleAmountChange}
                    value={amount}
                    helperText={!validAmount ? "please enter a valid amount" : ""}
                    variant="standard" />

                <FormControl className={styles["from_control"]}>
                    <InputLabel id="from-currency-label">From</InputLabel>
                    <Select
                        labelId="from-currency-label"
                        id="from-currency-select"
                        value={fromCurrency}
                        label="From"
                        onChange={handleFromChange}
                    >
                        {menuItems.map((item) => (<MenuItem key={item.currency} value={item.currency}>{item.name}</MenuItem>))}

                    </Select>
                </FormControl>
                <FormControl className={styles["to_control"]}>
                    <InputLabel id="to-currency-label">To</InputLabel>
                    <Select
                        labelId="to-currency-label"
                        id="to-currency-select"
                        value={toCurrency}
                        label="To"
                        onChange={handleToChange}
                    >
                        {menuItems.map((item) => (<MenuItem key={item.currency} value={item.currency}>{item.name}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>
            <br />

            <Button className={styles["convert_btn"]} onClick={convert} variant="outlined">Convert</Button>
            <br />

            {showCard && card}
        </div>

    )
}

export default Saved;