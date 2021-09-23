import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
    useHistory
} from "react-router-dom";

function LinkTab(props) {
    const history = useHistory();

    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
                history.push(props.to)
            }}
            {...props}
        />
    );
}

export default function Header() {
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        if (window.location.pathname === "/") {
            setValue(0)
        }
        else if (window.location.pathname === "/charts") {
            setValue(1)
        }
        else if (window.location.pathname === "/saved") {
            setValue(2)
        }

    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
                <LinkTab label="Rates" to="/" />
                <LinkTab label="Charts" to="/charts" />
                <LinkTab label="Saved" to="/saved" />
            </Tabs>
        </Box>
    );
}
