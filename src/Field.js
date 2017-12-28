import React from 'react';

export default class Field extends React.Component {
    componentDidMount() {
        const { control } = this.props;
        // Add listener
        if (control) {
            control.stateChanges.subscribe(() => {
               this.forceUpdate();
            });
        }
    }
    addListener(control) {
        if(control) {
            control.stateChanges.subscribe(() => {
                this.forceUpdate();
            });
        }
    }
    removeListener(control) {
        if(control) {
            if (control.stateChanges.observers) {
                control.stateChanges.observers.forEach((observer) => {
                  control.stateChanges.unsubscribe(observer);
                });
            }
        }
    }
    componentWillUnmount() {
        // Remove Listener
        this.removeListener();
    }
    shouldComponentUpdate() {
        return false;
    }
    getComponent() {
        const { render, control } = this.props;
        if (control) {
            return render(control) || null;
        }
        return null;
    }
    render() {
        return this.getComponent();
    }
}