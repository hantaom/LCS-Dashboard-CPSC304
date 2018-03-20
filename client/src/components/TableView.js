import 'react-table/react-table.css'
import React from "react";
import ReactTable from "react-table";


export default class TableView extends React.Component {

constructor(props) {
    super(props);
}
render()
    {
        return (
            <div>
                <ReactTable
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "Summoner Name",
                                },
                                {
                                    Header: "KDA",

                                },
                                {
                                    Header: "Kills (Total)"
                                },
                                {
                                    Header: "Deaths (Total)"
                                },
                                {
                                    Header: "Assists (Total)"
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    Header: "Kill Participation",
                                    accessor: "kp"
                                },
                                {
                                    Header: "CSPM",
                                    accessor: "cspm"
                                },
                                {
                                    Header: "CS (Total)"
                                },
                                {
                                    Header: "Minutes Played"
                                },
                                {
                                    Header: "Games Played"
                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }
}

