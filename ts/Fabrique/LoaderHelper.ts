export default class LoaderHelper {
    public static show(): void {
        let loader: HTMLElement = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    public static hide(): void {
        let loader: HTMLElement = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}
