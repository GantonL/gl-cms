<script lang="ts">
	import { page } from "$app/stores";
	import Currency from "$lib/components/currency/currency.svelte";
	import * as Card from "$lib/components/ui/card";
	import { t } from "$lib/i18n/translations";
	import type { Project } from "$lib/models/project";
	import { HandCoins, LoaderCircle } from "lucide-svelte";
	import { onMount } from "svelte";
	
	let totalPaymentsInProgress = true;
	let totalPayments = 0;

	$: project = $page.data.project as Project;
	
	onMount(() => {
		initializeData();
	})


	function initializeData() {
		getTotalPayments();
	}
	
	function getTotalPayments() {
		totalPaymentsInProgress = true;
		fetch(`/projects/${project.id}/dashboard/total-payments`, { method: 'GET' })
			.then((res) => {
				res.json()?.then((data) => {
					totalPayments = data;
				})
				.finally(() => totalPaymentsInProgress = false)
			})
			.finally(() => totalPaymentsInProgress = false)
	}

</script>
<h1>{$t('common.dashboard')}</h1>
<div class="py-4 flex flex-row flex-wrap items-center gap-4">
	<Card.Root>
		<Card.Header>
			<div class="flex flex-row gap-4 items-start">
				<HandCoins size=32/>
				<div class="flex flex-col gap-2">
					<Card.Title>{$t('common.total_payments')}</Card.Title>
					<Card.Description>{$t('common.total_payments_dashboard_description')}</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Content>
			{#if totalPaymentsInProgress}
				<LoaderCircle size=18 class="animate-spin"/>
			{:else}
				<span class="font-bold text-lg text-primary">
					<Currency styleClass="w-fit">{totalPayments}</Currency>
				</span>
			{/if}
		</Card.Content>
	</Card.Root>
</div>