---
title: ''
description: ''
date: ''
---
<script lang="ts">
  import FormShadowTemplate from '$lib/components/forms/form-shadow-template/form-shadow-template.svelte';
  import SignaturePad from '$lib/components/signature-pad/signature-pad.svelte';
</script>
<FormShadowTemplate />
<div class="h-72">
  <SignaturePad on:confirmed={(event) => console.log(event.detail)}/>
</div>