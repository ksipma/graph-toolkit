import classNames from "classnames";
import { useState, useEffect, useRef, Component } from "react";
import { Classes } from "@blueprintjs/core";
import { Navigation } from "./components/Navigation/Navigation";
import { ForceGraph } from "./components/ForceGraph/ForceGraph";
import { TimeSlider } from "./components/TimeSlider/TimeSlider";

interface AppProps {

}

interface AppState {
    data: any,
    timeSlots: string[],
    selectedTimeSlots: string[],
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            data: {},
            timeSlots: [],
            selectedTimeSlots: [],
        }
    }

    public componentDidMount() {
        // fetch data from json file
        const dataFetch = async () => {
            const data = await (
                await fetch(
                    "../datasets/dataset.json"
                )
            ).json();

            this.setState((state) => ({
                data: data,
                timeSlots: Object.keys(data),
                selectedTimeSlots: Object.keys(data)
            }));
        };

        dataFetch();
    }

    private onDateChange = (dates: string[]): void => {
        this.setState((state) => ({ selectedTimeSlots: dates }));
    }

    public render = (): JSX.Element => {
        return (
            <div
                className={classNames("app", {
                    [Classes.DARK]: true
                })}
            >
                <Navigation />
                <div className="examples-container">
                    <ForceGraph data={this.state.data} dates={this.state.selectedTimeSlots} />
                    <TimeSlider dates={this.state.timeSlots} onDateChange={this.onDateChange} />
                </div>

            </div>
        );
    }
}
// function App() {

//     // here we fetch the data from the server and divide it in the ForceGraph and the TimeSlider

//     // this will hold the jsonfile
//     const [data, setData] = useState({});
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

//     useEffect(() => {
//         // fetch data from json file
//         const dataFetch = async () => {
//             const data = await (
//                 await fetch(
//                     "../datasets/dataset.json"
//                 )
//             ).json();

//             setData(data);
//             setTimeSlots(Object.keys(data));
//             setSelectedTimeSlots(Object.keys(data));
//         };

//         dataFetch();
//     }, []);

//     return (
//         <div
//             className={classNames("app", {
//                 [Classes.DARK]: true
//             })}
//         >
//             <Navigation />
//             <div className="examples-container">
//                 <ForceGraph data={data} dates={selectedTimeSlots} />
//                 <TimeSlider dates={timeSlots} onDateChange={setSelectedTimeSlots} />
//             </div>

//         </div>
//     );
// }

export default App;
