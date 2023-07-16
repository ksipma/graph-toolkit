import React from "react";
import { useState, useEffect, useRef } from "react";
import { RangeSlider, NumberRange, Button, ButtonGroup, Tooltip } from "@blueprintjs/core";
import { } from "@blueprintjs/core";
import { ForceGraph2D } from 'react-force-graph';

export const ForceGraphExample: React.FC = () => {

    // ............................................................................
    // setting of parameters for this component
    // ............................................................................
    // because we use pure javascript hooks(interval), we need to use refs to store the values, otherwise the component will not update.
    // For: data, sliderRange, sliderMax, sliderDragSize, sliderValues, leftDragFrozen, rightDragFrozen, activatePlay this is the case.

    // this will hold the jsonfile
    const initialData = {};
    const [data, setData] = useState({});
    const dataRef = useRef(initialData);

    // stuff for the graph
    const [height, setHeight] = useState(100);
    const [width, setWidth] = useState(100);
    const [graphData, setgraphData] = useState({ nodes: [], links: [] });
    const [visibleNodes, setVisibleNodes] = useState([]);

    //stuff for the timeslider
    const initialSliderRange = [36, 72]
    const [sliderRange, setRange] = useState(initialSliderRange);
    const sliderRangeRef = useRef(initialSliderRange);

    const initialSliderMax = 100;
    const [sliderMax, setSliderMax] = useState(initialSliderMax);
    const sliderMaxRef = useRef(initialSliderMax);

    const initialSliderDragSize = 100;
    const [sliderDragSize, setSliderDragSize] = useState(initialSliderDragSize);
    const sliderDragSizeRef = useRef(initialSliderDragSize);

    const initialSliderValues = [];
    const [sliderValues, setSliderValues] = useState(initialSliderValues);
    const sliderValuesRef = useRef(initialSliderValues);


    // stuff for the player
    const [disablePlay, setDisablePlay] = useState(false);

    const initialLeftDragFrozen = false;
    const [leftDragFrozen, setLeftDragFrozen] = useState(initialLeftDragFrozen);
    const leftDragFrozenRef = useRef(initialLeftDragFrozen);

    const initialRightDragFrozen = false;
    const [rightDragFrozen, setRightDragFrozen] = useState(initialRightDragFrozen);
    const rightDragFrozenRef = useRef(initialRightDragFrozen);

    let initialActivatePlay = false;
    const [activatePlay, setActivatePlay] = useState(initialActivatePlay);
    const activatePlayRef = useRef(initialActivatePlay);
    const [icon, setIcon] = useState("play");

    // ............................................................................
    // Interatctions with the graph
    // ............................................................................

    // this is the label renderer for the slider, if not used it will show 1,2,3, now it shows the actual date
    const labelRenderer = (value: number) => `${sliderValues[value]}`;


    // here we check wether or not the player can be used, we validate before we can play
    const validatePlay = function () {
        let valid = true;

        // check if the left drag does not equal or is bigger the right drag
        if (sliderRange[0] >= sliderRange[1]) {
            valid = false;
        }
        // check if the slider range is not bigger then 1/4th of the dataset, if bigger there is no real benefit of the player
        if ((sliderRange[1] - sliderRange[0]) < (sliderValues.length / 4)) {
            valid = false;
        }

        // update the validation status
        setDisablePlay(valid);
    };

    // with this toggle you can turn on /off the animation
    const toggleAnimation = function () {
        activatePlayRef.current = !activatePlayRef.current;
        setActivatePlay(activatePlayRef.current);
        setIcon(activatePlayRef.current ? 'play' : 'pause');

    };

    // with this toggle you can lock the left drag, we release the right drag if the left drag is locked
    const toggleLeftDrag = function () {
        leftDragFrozenRef.current = !leftDragFrozenRef.current;
        if (leftDragFrozenRef.current) {
            rightDragFrozenRef.current = false;
            setRightDragFrozen(rightDragFrozenRef.current);
        }
        setLeftDragFrozen(leftDragFrozenRef.current);
    };

    // with this toggle you can lock the right drag, we release the left drag if the right drag is locked
    const toggleRightDrag = function () {
        rightDragFrozenRef.current = !rightDragFrozenRef.current;
        if (rightDragFrozenRef.current) {
            leftDragFrozenRef.current = false;
            setLeftDragFrozen(leftDragFrozenRef.current);
        }
        setRightDragFrozen(rightDragFrozenRef.current);
    };

    // method to filter nodes in the graphcomponent
    const filterGraph = function () {
        // we iterate all days inside the slider range and keep the unique nodes. These should be the visible ones
        let nodes = [];
        for (let i = sliderRangeRef.current[0]; i < sliderRangeRef.current[1]; i++) {
            nodes = nodes.concat(dataRef.current[sliderValuesRef.current[i]]['nodes']);
        }
        nodes = nodes.filter((item, pos) => nodes.indexOf(item) === pos)
        setVisibleNodes(nodes);
    };

    // method to process the timeline handle on drag
    const handleValueChange = function (range: NumberRange) {
        sliderRangeRef.current = range;
        setRange(sliderRangeRef.current);
        sliderDragSizeRef.current = range[1] - range[0];
        setSliderDragSize(sliderDragSizeRef.current);
        validatePlay(); // we validate the play button on every drag event
    };

    //method to process the handle on release, this will trigger the actual update of the graph
    const handleGraphUpdate = function () {
        filterGraph();
    }

    // ............................................................................
    // Interval(animation)
    // ............................................................................

    // here we set the interval for the player, the player runs every seconds, but depeding on button states it actually performs different rendering
    useEffect(() => {
        const interval = setInterval(function () {
            if (activatePlayRef.current) {
                let newRange = [sliderRangeRef.current[0] + sliderDragSizeRef.current, sliderRangeRef.current[1] + sliderDragSizeRef.current];

                // magic if the right drag goes further then the max
                if (newRange[1] > sliderMaxRef.current) {
                    newRange[1] = sliderMaxRef.current;
                }

                // magic if the left drag goes over the max
                if (newRange[0] > sliderMaxRef.current) {
                    newRange = [0, sliderDragSizeRef.current];
                }

                // magic if the left drag is frozen...
                if (leftDragFrozenRef.current) {
                    newRange[0] = sliderRangeRef.current[0];
                    if (newRange[1] < newRange[0]) {
                        newRange[1] = newRange[0] + sliderDragSizeRef.current;
                    }
                    if (newRange[1] >= sliderMaxRef.current) {
                        newRange[1] = sliderDragSizeRef.current + newRange[0];
                    }
                }

                // magic if the right drag is frozen...
                if (rightDragFrozenRef.current) {
                    newRange[1] = sliderRangeRef.current[1];
                    if (newRange[0] > newRange[1]) {
                        newRange[0] = 0;
                    }
                }

                // manipulate the dom
                sliderRangeRef.current = newRange;
                setRange(newRange);
                filterGraph();
            }
            // we could slow or speed up the
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // ............................................................................
    // Resizing the graph
    // ............................................................................

    // stuff for resizing the graph so it fit's nicely inside the blueprinjs framework
    const adjustSize = function () {
        let w = document.documentElement.clientWidth;
        let h = document.documentElement.clientHeight;
        setHeight(h - 140); // 140 seems the be about right
        setWidth(w); // if a horizontal scrollbar appears, we need to adjust this
    };

    // listen for updating the size
    window.addEventListener("resize", adjustSize);

    // initial setting the size when opening the page, because the event lister only triggers on resize, not on load
    useEffect(() => {
        adjustSize();
    });

    // ............................................................................
    // Fetching the data from the database
    // ............................................................................

    // fethcing the dataset and initial setting the slider and graph, we trigger this only once
    useEffect(() => {
        // fetch data from json file
        const dataFetch = async () => {
            const data = await (
                await fetch(
                    "../datasets/dataset.json"
                )
            ).json();

            // setting stuff for the slider, we need to make slots per day
            const max = Object.keys(data).length - 1;
            const values = Object.keys(data);

            // here we start rendering the nodes and links(using all the data from the doc)
            let nodes = [];
            let links = [];
            try {
                for (let i = 0; i < values.length; i++) {
                    nodes = nodes.concat(data[values[i]]['nodes']);
                    links = links.concat(data[values[i]]['links']);
                }
                nodes = nodes.filter((item, pos) => nodes.indexOf(item) === pos)
            } catch (e) {
                console.log(e);
            }

            // updating all properties so the graph can function
            sliderMaxRef.current = max;
            setSliderMax(sliderMaxRef.current);
            sliderRangeRef.current = [0, max];
            setRange(sliderRangeRef.current);
            sliderDragSizeRef.current = max;
            setSliderDragSize(sliderDragSizeRef.current);
            sliderValuesRef.current = values;
            setSliderValues(sliderValuesRef.current);
            dataRef.current = data;
            setData(dataRef.current);
            setVisibleNodes(nodes);
            setgraphData({
                nodes: nodes.map((node: any) => {
                    return {
                        id: node
                    }
                }), links: links
            });
            validatePlay();
        };

        dataFetch();
    }, []);

    // ............................................................................
    // HTML rendering of component
    // ............................................................................
    return (
        <div>
            <div className="graph">
                <ForceGraph2D
                    width={width}
                    height={height}
                    graphData={graphData}
                    nodeLabel={node => `${node.id}`}
                    nodeVisibility={node => visibleNodes.includes(node.id)}
                    linkVisibility={link => visibleNodes.includes(link.source.id) && visibleNodes.includes(link.target.id)}
                    nodeAutoColorBy="user"
                    linkDirectionalParticles={1}
                />
            </div>
            <div className="range-slider">
                <div className="range-slider-drag">
                    <RangeSlider
                        disabled={activatePlay}
                        min={0}
                        max={sliderMax}
                        stepSize={1}
                        labelRenderer={labelRenderer}
                        onChange={handleValueChange}
                        onRelease={handleGraphUpdate}
                        value={sliderRange}
                        handleHtmlProps={{ start: { "aria-label": "example start" }, end: { "aria-label": "example end" } }}
                    />
                </div>
                <div className="range-slider-bttons">
                    <Tooltip content={disablePlay === true ? 'Selecteer maximaal 1/4e van je dataset via de dataslider om deze controls te gebruiken' : 'Tip: Met de pins kun je controls vastzetten.'}>
                        <ButtonGroup>
                            <Button icon={icon} text={icon === 'play' ? 'play' : 'pause'} disabled={disablePlay} active={activatePlay} onClick={toggleAnimation} />
                            <Button icon="pin" text="pin linker control" disabled={disablePlay} active={leftDragFrozen} onClick={toggleLeftDrag} />
                            <Button icon="pin" text="pin rechter control" disabled={disablePlay} active={rightDragFrozen} onClick={toggleRightDrag} />
                        </ButtonGroup>
                    </Tooltip>
                </div>
            </div >
        </div >
    );
};
