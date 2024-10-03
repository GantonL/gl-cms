<script>
  import { FileSignature } from "lucide-svelte";
</script>
<div class="border rounded-md h-24 w-20 flex flex-col items-center gap-2 p-2">
  <div class="bg-secondary h-2 w-3/4 rounded-md"></div>
  <div class="flex flex-col items-start gap-2 w-full">
    <div class="bg-secondary border-b-2 w-full"></div>
    <div class="bg-secondary border-b-2 w-3/4"></div>
    <div class="bg-secondary border-b-2 w-1/3"></div>
    <div class="bg-secondary border-b-2 w-1/2"></div>
  </div>
  <div class="flex items-end justify-end flex-grow w-full">
    <FileSignature size=14 class=" text-secondary"/>
  </div>
</div>