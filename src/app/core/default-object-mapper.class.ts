export class DefaultObjectMapper {
    static map<T>(source: T | T[], type: new () => T) {
        if (Array.isArray(source)) {
            return source.map(item => Object.assign(new type(), item));
        } else {
            return Object.assign(new type(), source);
        }
    }
}
