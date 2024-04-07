import { useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/solid";
import {useAuth} from "../contexts/AuthContext";
import {Box, Divider} from "@mui/material";



const projectNames = ["GUI", "Firebase", "React"]

export default function Dashboard() {
    const projectNames = ["GUI", "Firebase", "React", "Thing", "Thang", "Apple", "Orange", "Banana", "Grape", "Mango", "Fly", "Carrot", "Broccoli"]

    return (
        <div className="App">
                <Box>
                    <Box
                        bgcolor="white"
                        style={{
                            overflowY: "auto",
                            maxHeight: "450px",
                            display: "flex",
                            flexGrow: 1,
                            flexDirection: "column"
                        }}
                        height={800}
                        width={400}
                        my={2}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        sx={{ border: '2px solid grey' }}
                    >
                        {projectNames.map((data) => {
                            return (
                                <>
                                    <button
                                        className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full transition-all duration-500"
                                        onClick={() => console.log("ok")}
                                    >
                                        <p>{data}</p>
                                    </button>
                                    <Divider />
                                </>
                            );
                        })}
                    </Box>
                </Box>
        </div>
    );
}
