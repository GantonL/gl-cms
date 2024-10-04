<script lang="ts">
	import SignaturePad from "signature_pad";
	import { createEventDispatcher, onMount } from "svelte";
	import { Button } from "../ui/button";
	import { t } from "$lib/i18n/translations";

  let canvas: HTMLCanvasElement;
  let signature: SignaturePad;
  const dispath = createEventDispatcher();

  onMount(() => {
    signature = new SignaturePad(canvas, {
      backgroundColor: `rgb(255, 255, 255)`,
    });
    window.onresize = resizeCanvas;
    resizeCanvas();
  });

  function resizeCanvas() {
    const ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas?.getContext("2d")?.scale(ratio, ratio);
  }

  function onClear() {
    signature.clear();
    return false;
  }

  function onConfirm() {
    dispath('confirmed', signature.toDataURL('image/svg+xml', {includeBackgroundColor: true}))
  }

</script>
<div class="flex flex-col items-center w-full h-full">
  <div class="flex items-center justify-center p-2 border rounded-t-md w-full"><span>{$t('common.signature')}</span></div>
  <div class="relative w-full flex-grow">
    <canvas bind:this={canvas} class="absolute left-0 top-0 w-full h-full border rounded-b-md bg-white"></canvas>
  </div>
  <div class="flex flex-row gap-2 items-center w-full py-2">
    <Button class="flex-grow" on:click={onConfirm}>{$t('common.confirm')}</Button>
    <Button class="flex-grow" variant="outline" on:click={onClear}>{$t('common.clear')}</Button>
  </div>
</div>