export function fixLocalLinksInCashedSource(
    source: string,
    url: string
): string {

    let baseUrl = url.replace(/(?<=https:\/\/.+)\/.+/, "");

    source = source.replace(/href\s*=\s*"\//g, `href="${baseUrl}/`);
    return source.replace(/src\s*=\s*"\//g, `src="${baseUrl}/`);
}