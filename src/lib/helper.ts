// In case global.setTimeout gets replaced
// (e.g. sinon.useFakeTimers())
const setTimeout = global.setTimeout;

export async function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}
