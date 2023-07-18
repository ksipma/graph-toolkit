import { Component } from 'react';
import { RangeSlider, NumberRange, Button, ButtonGroup, Tooltip } from "@blueprintjs/core";

interface TimeSliderProps {
    dates: string[],
    onDateChange: (dates: string[]) => void
}

interface TimeSliderState {
    dates: string[],
    valid: boolean,
    leftDragFrozen: boolean,
    rightDragFrozen: boolean,
    activatePlay: boolean,
    icon: string,
    sliderRange: NumberRange,
    sliderDragSize: number,
    sliderMax: number
}

export class TimeSlider extends Component<TimeSliderProps, TimeSliderState> {
    public static defaultProps = {
        dates: [],
    };

    constructor(props: TimeSliderProps) {
        super(props);
        this.state = {
            dates: [],
            valid: false,
            leftDragFrozen: false,
            rightDragFrozen: false,
            activatePlay: false,
            icon: 'play',
            sliderRange: [0, 100],
            sliderDragSize: 100,
            sliderMax: 100
        }
    }

    private labelRenderer = (value: number): string => {
        try {
            return this.state.dates[value];
        } catch (err) {
            return "onbekend";
        }
    }

    private toggleAnimation = (): void => {

        // toggle the switch and update the icon
        this.setState((state) => ({ activatePlay: !state.activatePlay, }), () => {
            this.setState((state) => ({ icon: state.activatePlay ? 'play' : 'pause' }));
        });

    };

    private toggleLeftDrag = (): void => {
        this.setState((state) => ({ leftDragFrozen: !this.state.leftDragFrozen }), () => {
            if (this.state.leftDragFrozen) {
                this.setState((state) => ({ rightDragFrozen: false }));
            }
        });
    };

    private toggleRightDrag = (): void => {
        this.setState((state) => ({ rightDragFrozen: !this.state.rightDragFrozen }), () => {
            if (this.state.rightDragFrozen) {
                this.setState((state) => ({ leftDragFrozen: false }));
            }
        });
    };

    // method to process the timeline handle on drag
    private handleValueChange = (range: NumberRange): void => {
        this.setState((state) => ({
            sliderRange: range,
            sliderDragSize: range[1] - range[0]
        }));
    };

    private getSelectedDates = (): string[] => {
        let selectedDates: string[] = [];
        for (let i = this.state.sliderRange[0]; i < this.state.sliderRange[1]; i++) {
            selectedDates.push(this.state.dates[i]);
        }
        return selectedDates;

    }

    //method to process the handle on release, this will trigger the actual update of the graph
    private handleGraphUpdate = (): void => {
        let valid = true,
            selectedDates = this.getSelectedDates();

        // check if the left drag does not equal or is bigger the right drag
        if (this.state.sliderRange[0] >= this.state.sliderRange[1]) {
            valid = false;
        }
        // check if the slider range is not bigger then 1/4th of the dataset, if bigger there is no real benefit of the player
        if (selectedDates.length > (this.state.dates.length / 4)) {
            valid = false;
        }

        this.setState((state) => ({ valid: valid }));
        this.props.onDateChange(selectedDates);
    }

    public componentDidMount = (): void => {
        const self = this;
        const interval = setInterval(function () {
            if (self.state.activatePlay) {
                let newRange: NumberRange = [self.state.sliderRange[0] + self.state.sliderDragSize, self.state.sliderRange[1] + self.state.sliderDragSize];


                // magic if the right drag goes further then the max
                if (newRange[1] > self.state.sliderMax) {
                    newRange[1] = self.state.sliderMax;
                }

                // magic if the left drag goes over the max
                if (newRange[0] > self.state.sliderMax) {
                    newRange = [0, self.state.sliderDragSize];
                }

                // magic if the left drag is frozen...
                if (self.state.leftDragFrozen) {
                    newRange[0] = self.state.sliderRange[0];
                    if (newRange[1] < newRange[0]) {
                        newRange[1] = newRange[0] + self.state.sliderDragSize;
                    }
                    if (newRange[1] >= self.state.sliderMax) {
                        newRange[1] = self.state.sliderDragSize + newRange[0];
                    }
                }

                // magic if the right drag is frozen...
                if (self.state.rightDragFrozen) {
                    newRange[1] = self.state.sliderRange[1];
                    if (newRange[0] > newRange[1]) {
                        newRange[0] = 0;
                    }
                }

                if (newRange[0] !== self.state.sliderRange[0] || newRange[1] !== self.state.sliderRange[1]) {
                    // manipulate the dom
                    self.setState((state) => ({ sliderRange: newRange }), () => {
                        let selectedDates = self.getSelectedDates();
                        self.props.onDateChange(selectedDates);
                    });
                }


            }
            // we could slow or speed up the visualisation
        }, 1000);

    }

    //this listener will listen to changes in the datetime selection, if changes occur, we reset the component to the new values
    public static getDerivedStateFromProps = (props: TimeSliderProps, state: TimeSliderState) => {
        if (props.dates !== state.dates) {
            return {
                dates: props.dates,
                sliderMax: props.dates.length,
                sliderRange: [0, props.dates.length - 1],
                valid: false,
                leftDragFrozen: false,
                rightDragFrozen: false
            }
        }
        return null;
    }

    // // ............................................................................
    // // HTML rendering of component
    // // ............................................................................
    public render() {
        return <div className="range-slider">
            {this.state.valid}
            < div className="range-slider-drag" >
                <RangeSlider
                    disabled={this.state.activatePlay}
                    min={0}
                    max={this.state.sliderMax}
                    stepSize={1}
                    labelRenderer={this.labelRenderer}
                    onChange={this.handleValueChange}
                    onRelease={this.handleGraphUpdate}
                    value={this.state.sliderRange}
                    handleHtmlProps={{ start: { "aria-label": "example start" }, end: { "aria-label": "example end" } }}
                />
            </div >
            <div className="range-slider-buttons">
                <Tooltip content={this.state.valid === false ? 'Selecteer maximaal 1/4e van je dataset via de dataslider om deze controls te gebruiken' : 'Tip: Met de pins kun je controls vastzetten.'}>
                    <ButtonGroup>
                        <Button icon={this.state.icon} text={this.state.icon === 'play' ? 'play' : 'pause'} disabled={!this.state.valid} active={this.state.activatePlay} onClick={this.toggleAnimation} />
                        <Button icon="pin" text="pin linker control" disabled={!this.state.valid} active={this.state.leftDragFrozen} onClick={this.toggleLeftDrag} />
                        <Button icon="pin" text="pin rechter control" disabled={!this.state.valid} active={this.state.rightDragFrozen} onClick={this.toggleRightDrag} />
                    </ButtonGroup>
                </Tooltip>
            </div>
        </div >
    }
};
