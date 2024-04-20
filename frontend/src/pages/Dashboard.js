import React, { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Button} from "@mui/joy"
import {Box, Divider, Card, CardActions} from "@mui/material";

const projectNames = ["HOME", "Firebase", "React", "Thing", "Thang", "Apple", "Orange", "Banana", "Grape", "Mango", "Fly", "Carrot", "Broccoli"]
const documentNames = [["HomeDocument1", "HomeDocument2", "HomeDocument3"], ["FirebaseDocument1", "FirebaseDocument2", "FirebaseDocument3"]]

export default function Dashboard() {
    const [projectID, setProjectID] = React.useState(0);

    const renderDocumentNames = () => {
        return documentNames[projectID].map((data) => (
                <button
                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                    onClick={() => console.log("ok")}
                >
                    <p>{data}</p>
                </button>

        ))
    }

    return (
        <div className="App">
                <Box
                    sx={{
                        height: '100vh',
                        overflow: 'auto',
                        justifyContent: "center",
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginTop: '30px',
                        alignContent: 'space-between'
                    }}>
                    <Box
                        bgcolor="white"
                        style={{
                            overflowY: "auto",
                            maxHeight: "425px",
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column",
                            marginLeft: "25px",
                            marginRight: "25px"
                        }}
                        height={800}
                        width={200}
                        my={0}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        sx={{ border: '2px solid grey' }}
                    >
                        {projectNames.map((data, index) => {
                            return (
                                <>
                                    <button
                                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                        onClick={async () => setProjectID(index)}
                                    >
                                        <p>{data}</p>
                                    </button>
                                </>
                            );
                        })}
                        <>
                            <button
                                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                onClick={() => console.log("ok")}
                            >
                                <p>+</p>
                            </button>
                        </>
                    </Box>
                        <Box
                            bgcolor="white"
                            style={{
                                overflowY: "auto",
                                maxHeight: "425px",
                                display: "column",
                                flexGrow: 1,
                                flexDirection: "column",
                                marginLeft: "25px",
                                marginRight: "25px"
                            }}
                            height={800}
                            width={200}
                            my={0}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            p={2}
                            sx={{ border: '2px solid grey' }}
                        >
                            <Box component="h2">
                                <Card>
                                    <CardActions>
                                            <input
                                                type="text"
                                                placeholder="Add employee..."
                                                className="w-full border-2 border-gray-300 p-2 rounded-full transition-all duration-500"
                                            />
                                            <button
                                                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                                                onClick={() => console.log("ok")}
                                            >
                                                <ArrowRightIcon className="h-6 w-6"/>
                                            </button>
                                        <button
                                            className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                            onClick={() => console.log("ok")}
                                        >
                                            <p>Members</p>
                                        </button>
                                    </CardActions>
                                </Card>
                            </Box>
                            <Divider color="#1bc41e" sx={{height: 2, width: '525px'}}></Divider>

                            {renderDocumentNames()}
                            <button
                                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                onClick={() => console.log("ok")}
                            >
                                <p>+</p>
                            </button>

                        </Box>
                </Box>
        </div>
    );
}
