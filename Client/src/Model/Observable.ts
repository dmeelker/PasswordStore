import React from "react";

type Listener<T> = (value: T) => void;
type Unsubscriber = () => void;

export class Observable<T> {
    private listeners: Listener<T>[] = [];
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    public get(): T {
        return this.value;
    }

    public set(newValue: T) {
        if (this.value !== newValue) {
            this.value = newValue;
            this.listeners.forEach(l => l(this.value));
        }
    }

    public notifyListeners() {
        this.listeners.forEach(l => l(this.value));
    }

    public addListener(listener: Listener<T>): Unsubscriber {
        this.listeners.push(listener);

        return () => {this.listeners = this.listeners.filter(l => l !== listener)};
    }
}

export function useObservable<T>(observable: Observable<T>) {
    const [value, setValue] = React.useState(observable.get());

    React.useEffect(() => {
        return observable.addListener(setValue);
    }, [observable]);

    return value;
}