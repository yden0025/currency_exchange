import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import { TimeSeries } from "pondjs";
import {
    Charts as Chart,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
    Resizable
} from "react-timeseries-charts";

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../redux/hook';
import { getTrend, trendSlice } from "../../redux/trend/slice";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import axios from 'axios';

const Charts: React.FC = (props) => {
    const openDate = useSelector(({ openDate }) => openDate.openDate);
    const currencies = useSelector(({ currency }) => currency.data);
    const points = useSelector(({ trend }) => trend.data);
    const [fromCurrency, setFromCurrency] = useState("usd")
    const [toCurrency, setToCurrency] = useState("aud")
    const [loading, setLoading] = useState(false)
    const [source, setSource] = useState(axios.CancelToken.source())
    const [series, setSeries] = useState(new TimeSeries({
        name: "timeseries",
        columns: ["index", "value"],
        points: []
    }))
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            setLoading(true)
            await fetchData()
            setLoading(false)
        })()

        // return () => {
        //     source.cancel('Operation canceled by the user.');
        // }
    }, [])

    useEffect(() => {
        (async () => {
            setLoading(true)
            await fetchData()
            setLoading(false)
        })()
    }, [fromCurrency, toCurrency])

    useEffect(() => {
        setSeries(new TimeSeries({
            name: "timeseries",
            columns: ["index", "value"],
            points
        }))
    }, [points])

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

    const handleFromChange = (e: SelectChangeEvent) => {
        if (loading) {
            return
        }
        setFromCurrency(e.target.value)
    }

    const handleToChange = (e: SelectChangeEvent) => {
        if (loading) {
            return
        }
        setToCurrency(e.target.value)
    }

    const reverse = () => {
        if (loading) {
            return
        }
        let temp = fromCurrency
        setFromCurrency(toCurrency)
        setToCurrency(temp)
    }

    const fetchData = async () => {
        if (loading) {
            return
        }

        await source.cancel('Operation canceled by the user.');

        let startDate = dayjs(openDate, "YYYY-MM-DD")
        let endDate = dayjs()

        await dispatch(trendSlice.actions.emptyTrend())

        const newSource = axios.CancelToken.source();
        setSource(newSource)

        dayjs.extend(isSameOrBefore)
        while (startDate.isSameOrBefore(endDate)) {
            let dateStr = startDate.format("YYYY-MM-DD")

            await dispatch(getTrend({ dateStr: dateStr, from: fromCurrency, to: toCurrency, source: newSource }))
            startDate = startDate.add(1, 'day')
        }
    }

    const style = {
        value: {
            stroke: "#a02c2c",
            opacity: 0.2
        }
    };

    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <FormControl>
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
                <IconButton onClick={reverse} aria-label="reverse">
                    <CompareArrowsIcon />
                </IconButton>
                <FormControl>
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

            {/* time series chart */}
            {(!loading && series.range() !== undefined) ? (<Resizable>
                <ChartContainer
                    title={`${toCurrency} price (${fromCurrency})`}
                    titleStyle={{ fill: "#555", fontWeight: 600 }}
                    timeRange={series.range()}
                    format="%b '%y"
                    timeAxisTickCount={10}
                >
                    <ChartRow height="500">
                        <YAxis
                            id="price"
                            label="Price"
                            min={series.min()}
                            max={series.max()}
                            width="60"
                            format="$,.5f"
                        />
                        <Chart>
                            <LineChart axis="price" series={series} style={style} />
                        </Chart>
                    </ChartRow>
                </ChartContainer>
            </Resizable>) : <div>loading</div>}
        </div>
    )
}

export default Charts;