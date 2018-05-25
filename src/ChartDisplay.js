import React, { Component } from 'react';
import "./ChartDisplay.css";
import TimeBar from './TimeBar';
import LineComponent from './LineComponent';
const Core = require("./core");

export default class ChartDisplay extends Component{

    constructor(props){
        super(props);
        let m, p, u, r;
        if(props.data){
            let {machines,processes,units,resolution} = props.data;
            m = machines;
            p = processes;
            u = units;
            r = resolution;
        }
        if(!p) p = this.loadTestProcesses();
        if(!m) m = this.loadTestLines();
        if(!u) u = 'days';
        if(!r) r = 60;
        let config = {
            lines: m,
            processes: p,
            reference: p.reduce((prev, current) => {
                if(prev.start>=current.start){
                    return current;
                }else{
                    return prev;
                }
            }, 0),
            resolution: r,
            units: u,
        }
        this.state = {
            core: new Core(config),
            units: u,
            resolution: r,
        };
    }
    loadTestProcesses = () => {
        let processes = [
            {
                name: "P1",
                start: 0,
                tasks: [
                    {
                        owner: "P1",
                        line: "M1",
                        index: 0,
                        duration: 60, // 3600000ms --> 1h
                    },
                    {
                        owner: "P1",
                        line: "M2",
                        index: 1,
                        duration: 30, // 1500000
                    },
                    {
                        owner: "P1",
                        line: "M1",
                        index: 2,
                        duration: 120, // 1500000
                    },
                ],
            },
            {
                name: "P2",
                start: 0,
                tasks: [
                    {
                        owner: "P2",
                        line: "M2",
                        index: 0,
                        duration: 60, // 3600000ms --> 1h
                    },
                    {
                        owner: "P2",
                        line: "M1",
                        index: 1,
                        duration: 60, // 3600000ms --> 1h
                    },
                ],
            },
        ];
        return processes;
    }
    loadTestLines = () => {
        let machines = [
            {
                name: "M1",
                workingHours: {start: 8, end: 17},
                workingDays: "all",
            },
            {
                name: "M2",
                workingHours: "24",
                workingDays: "all",
            }
        ];
        return machines;
    }
    render(){
        const tableIn = this.state.core.getLines().map((line, index) => {
            let parr = this.state.core.getProjections()[line.name];
            return (
                <tr key={index}>
                    <td
                    className="cd-lineName">{line.name}</td>
                    <td className="cd-line"><LineComponent data={parr} reference={this.state.core.getReference()} units={this.state.units} resolution={this.state.resolution} /></td>
                </tr>
            );
        });
        console.log("TableIn:",tableIn);
        return (
            <div align="center">
                <h1>ChartDisplay</h1>
                <div className="cd-container">
                    <table border="1"className="cd-table">
                        <thead>
                            <TimeBar units={this.state.units} resolution={this.state.resolution} />
                        </thead>
                        <tbody className="cd-content">
                            {tableIn}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}