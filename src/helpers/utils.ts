export default class Utils {
    static range(start: number, end: number): number[] { return [...Array(1 + end - start).keys()].map(v => start + v) }

    static getLastNLinesOfFromCurrentPosition(code, currentPosition, numberOfLines) {
        const splittedCode = code.split("\n")
        const lastNLinesFromCurrentPositionSplitted = splittedCode.slice(currentPosition - numberOfLines > 0 ? currentPosition - numberOfLines : 0, currentPosition)
        return lastNLinesFromCurrentPositionSplitted.join('\n');
    }

    static matchPhrase(input) {
        const SEARCH_PATTERN = /[\/\/|#|\-\-|<!\-\-]?(.+)\./
        let match = SEARCH_PATTERN.exec(input);
        return match && match.length ? match[1] : undefined;
    }

}