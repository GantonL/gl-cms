<script lang="ts">
	import { Calendar as CalendarPrimitive, type CustomEventHandler } from "bits-ui";
	import * as Calendar from "./index.js";
	import { cn } from "$lib/utils.js";
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { CalendarDate, getLocalTimeZone, now, Time, toCalendarDateTime, today, type AnyTime } from "@internationalized/date";
	import { Clock } from "lucide-svelte";
	import Separator from "../separator/separator.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	type $$Props = CalendarPrimitive.Props;

	type $$Events = CalendarPrimitive.Events & { timeChanged: CustomEventHandler };

	export let value: $$Props["value"] = undefined;
	export let time: AnyTime | undefined = undefined;
	export let placeholder: $$Props["placeholder"] = today(getLocalTimeZone());
	export let weekdayFormat: $$Props["weekdayFormat"] = "short";
	
	let className: $$Props["class"] = undefined;
	export { className as class };
	export let includeTime = false;

	const maxYears = 100;
	const yearOptions = Array.from({ length: maxYears }, (_, i) => ({
    	label: String(placeholder!.year - i),
    	value: placeholder!.year - i
  	}));
 
	const monthFormat = new Intl.DateTimeFormat('en-UK', {month: 'short'});
	const months = [...Array(12).keys()].map((_, index) => {
		const dateInMonth = new CalendarDate(maxYears, index+1, 1);
		const value = dateInMonth.month; 
		return {
		value,
		label: monthFormat.format(dateInMonth.toDate(getLocalTimeZone()))
		}
	});

	$: defaultYear = {
			value: placeholder!.year,
			label: String(placeholder!.year)
		}
	
	$: defaultMonth = {
			value: placeholder!.month,
			label: monthFormat.format(placeholder!.toDate(getLocalTimeZone()))
		}
 
	let nowTime = time ?? now(getLocalTimeZone());  
	$: timeValue = new Time(
			nowTime.hour, 
			nowTime.minute,
		);
  
</script>

<div class="flex flex-row gap-2 p-2">
	<Select.Root
		items={yearOptions}
		selected={defaultYear}
		onSelectedChange={(v) => {
			if (!v) return;
			placeholder = placeholder?.set({year: v.value});
			value = value?.set({year: v.value});
		}}
	>
		<Select.Trigger>
		<Select.Value placeholder="Year" />
		</Select.Trigger>
		<Select.Content class="max-h-48 overflow-auto">
		{#each yearOptions as item}
			<Select.Item value={item.value}>{item.label}</Select.Item>
		{/each}
		</Select.Content>
	</Select.Root>
	<Select.Root
		items={months}
		selected={defaultMonth}
		onSelectedChange={(v) => {
			if (!v) return;
			placeholder = placeholder?.set({month: v.value});
			value = value?.set({month: v.value});
		}}
	>
		<Select.Trigger>
		<Select.Value placeholder="Month" />
		</Select.Trigger>
		<Select.Content class="max-h-48 overflow-auto">
		{#each months as item}
			<Select.Item value={item.value}>{item.label}</Select.Item>
		{/each}
		</Select.Content>
	</Select.Root>
</div>
<CalendarPrimitive.Root
	bind:value
	bind:placeholder
	{weekdayFormat}
	class={cn("p-3", className)}
	{...$$restProps}
	on:keydown
	let:months
	let:weekdays

>
	<Calendar.Header>
		<Calendar.PrevButton />
		<Calendar.Heading />
		<Calendar.NextButton />
	</Calendar.Header>
	<Calendar.Months>
		{#each months as month}
			<Calendar.Grid>
				<Calendar.GridHead>
					<Calendar.GridRow class="flex">
						{#each weekdays as weekday}
							<Calendar.HeadCell>
								{weekday.slice(0, 2)}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="mt-2 w-full">
							{#each weekDates as date}
								<Calendar.Cell {date}>
									<Calendar.Day {date} month={month.value} />
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</Calendar.Months>
</CalendarPrimitive.Root>
{#if includeTime}
	<Separator />
	<div class="flex flex-row gap-2 items-center justify-between w-full p-2">
		<div class="flex flex-row gap-2 items-center">
			<Clock size=14/>
			<span>Time</span>
		</div>
		<div class="flex flex-row gap-2 items-center">
			<Input class="w-12" value={timeValue.hour} on:input={(e) => {
				timeValue = timeValue.set({hour: Number(e.target?.value)})
				dispatch('timeChanged', timeValue);
			}}/>
			<span>:</span>
			<Input class="w-12" value={timeValue.minute} on:input={(e) => {
				timeValue = timeValue.set({minute: Number(e.target?.value)})
				dispatch('timeChanged', timeValue);
			}}/>
		</div>
	</div>
{/if}