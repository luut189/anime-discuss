import Markdown from 'react-markdown';

export default function MarkdownPreview({ content }: { content: string }) {
    return (
        <div
            className={
                'h-32 rounded-md border p-2 text-base md:text-sm' +
                (content ? '' : ' text-muted-foreground')
            }>
            <Markdown>{content ? content.replace(/\n/g, '  \n') : 'Content Preview'}</Markdown>
        </div>
    );
}
