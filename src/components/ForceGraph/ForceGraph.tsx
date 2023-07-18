import { Component } from 'react';;
import { ForceGraph2D } from 'react-force-graph';

interface ForceGraphProps {
    data: any,
    dates: string[],
}

interface ForceGraphState {
    data: any,
    height: number,
    width: number,
    graphData: any,
    visibleNodes: string[],
}

export class ForceGraph extends Component<ForceGraphProps, ForceGraphState> {
    constructor(props: ForceGraphProps) {
        super(props);
        this.state = {
            height: 100,
            width: 100,
            graphData: { nodes: [], links: [] },
            visibleNodes: [],
        }
    }

    // stuff for resizing the graph so it fit's nicely inside the blueprinjs framework
    private adjustSize = (): void => {
        let w = document.documentElement.clientWidth;
        let h = document.documentElement.clientHeight;
        this.setState({ height: h - 140 });
        this.setState({ width: w });
    };

    public componentDidMount = (): void => {
        // listen for updating the size
        window.addEventListener("resize", this.adjustSize);
        this.adjustSize();

        let nodes: string[] = [];
        for (let i = 0; i < Object.keys(this.props.dates).length; i++) {
            nodes = nodes.concat(this.props.data[this.props.dates[i]]['nodes']);
        }
        nodes = nodes.filter((item, pos) => nodes.indexOf(item) === pos)
        this.setState({ visibleNodes: nodes });
    }

    public static getDerivedStateFromProps = (props, state) => {
        let nodes: any[] = [];
        let links: any[] = [];
        let visibleNodes: string[] = [];

        const keys = Object.keys(props.data);
        for (let i = 0; i < keys.length - 1; i++) {
            nodes = nodes.concat(props.data[keys[i]]['nodes']);
            links = links.concat(props.data[keys[i]]['links']);
        }
        nodes = nodes.filter((item, pos) => nodes.indexOf(item) === pos)

        for (let i = 0; i < Object.keys(props.dates).length; i++) {
            visibleNodes = visibleNodes.concat(props.data[props.dates[i]]['nodes']);
        }
        visibleNodes = visibleNodes.filter((item, pos) => visibleNodes.indexOf(item) === pos);

        let returnData: any = {
            dates: props.dates,
            visibleNodes: visibleNodes,
        }
        if (props.data !== state.data) {
            returnData['data'] = props.data;
            returnData['graphData'] = {
                nodes: nodes.map((node: any) => {
                    return {
                        id: node
                    }
                }), links: links

            }
        }
        return returnData;
    }

    public render = (): JSX.Element => {
        return (
            <div className="graph">
                <ForceGraph2D
                    width={this.state.width}
                    height={this.state.height}
                    graphData={this.state.graphData}
                    nodeLabel={node => `${node.id}`}
                    nodeVisibility={node => this.state.visibleNodes.includes(node.id)}
                    linkVisibility={link => this.state.visibleNodes.includes(link.source.id) && this.state.visibleNodes.includes(link.target.id)}
                    nodeAutoColorBy="user"
                    linkDirectionalParticles={1}
                />
            </div>
        );
    }
}
