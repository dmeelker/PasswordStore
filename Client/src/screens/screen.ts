import content from "*.html";

export interface IScreen {
    show(container: HTMLElement) : void;
    close() : void;
}

let screenContainer: HTMLElement;
let activeScreen: IScreen = null;

export function setScreenContainer(container: HTMLElement) {
    screenContainer = container;
}

export function setActiveScreen(screen: IScreen) {
    if (activeScreen != null) {
        activeScreen.close();
    }

    activeScreen = screen;
    activeScreen.show(screenContainer);
}