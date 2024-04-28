<script>
	import { page } from "$app/stores";
	import ArticleMarkdown from "$lib/components/article-markdown/article-markdown.svelte";
</script>
<ArticleMarkdown title={$page.data.title} content={$page.data.content}></ArticleMarkdown>