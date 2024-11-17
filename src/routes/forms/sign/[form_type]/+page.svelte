<script lang="ts">
	import { page } from "$app/stores";
	import { FormsMarkdowns } from "$lib/components/forms/markdowns";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { locale, t } from "$lib/i18n/translations";
	import { LoaderCircle } from "lucide-svelte";
	import { onMount, type ComponentType } from "svelte";
	import { font as NotoHebrewBase64} from "$lib/font/noto-sans/hebrew";

  let content: ComponentType;
  let confirmationDialogOpened = false;
  let confirmed = false;
  let html2pdf;
  let saveInProgress = false;

  $:formType = $page.data.formType;
  $:projectId = $page.data.projectId;
  $:userId = $page.data.userId;
  $:footer = $page.data.footer;

  onMount(async () => {
    const resourceId = `${$page.data.formType}_${locale.get()}`;
    const file = FormsMarkdowns[resourceId].file;
    content = await file[FormsMarkdowns[resourceId].path].default as ComponentType;
    const module = await import('html2pdf.js');
    html2pdf = module.default;  
  })

  function onConfirmed(event: CustomEvent) {
    if (!event.detail) return;
    confirmed = true;
    confirmationDialogOpened = true;
  }

  async function onSave() {
    saveInProgress = true;
    const element = document.getElementById(formType);
    const date = new Date();
    const baseMargin = 0.5;
    const opt = {
      margin: [baseMargin, baseMargin, baseMargin, baseMargin],
      filename: `${formType}_${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: 'css', before: '#content footer' }
    };
    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const pageCount = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.width;
      // const headerImage = 'path/to/your/header-image.png';
      // const imageWidth = 6; 
      // const imageX = (pageWidth - imageWidth) / 2; // Calculate center x-position
      const hebrewFontFilePath = 'fonts/NotoSansHebrew-Regular.ttf'; 
      pdf.addFileToVFS(hebrewFontFilePath, NotoHebrewBase64);
      pdf.addFont(hebrewFontFilePath, "notohebrew", "normal");
      pdf.setFont('notohebrew')
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      const displayFooter = footer.split("").reverse().join("");
      for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          const textHight = pdf.internal.pageSize.height - baseMargin;
          // pdf.addImage(headerImage, 'PNG', imageX, 0.2, imageWidth, 1);
          const pageCountText = `${i}/${pageCount}`;
          pdf.text(pageCountText, baseMargin, textHight);
          if (!footer) {
            continue;
          }  
          const textWidth = pdf.getTextWidth(footer);
          const textX = (pageWidth - textWidth) / 2;
          pdf.text(displayFooter, textX, textHight);
      }
      return pdf.output('blob');
    })
    .then((blob) => {
      const body = new FormData();
      body.append('blob', blob);
      body.append('projectId', projectId);
      body.append('userId', userId); 
      body.append('filename', opt.filename);
      fetch(formType, {method: 'POST', body})
      .catch((err: Error) => {
        //error handling
        console.error(err)
      })
      .finally(() => {
        saveInProgress = false;
        window.history.back();
      });
    })
    .catch((err: Error) => {
      console.error(err)
      saveInProgress = false;
    })
  }

  function onEdit() {
    confirmed = false;
  }
</script>
{#if content}
  <div id={formType} class="prose max-w-[800px] prose-img:m-0 prose-headings:text-secondary-foreground prose-headings:text-center pe-4 text-secondary-foreground text-justify">
    <svelte:component this={content} bind:confirmed on:confirmed={onConfirmed}></svelte:component>
  </div>
  {#if confirmed}
    <Button variant="secondary" class="w-full max-w-[800px]" on:click={onEdit}>{$t('common.edit')}</Button>
  {/if}
{:else}
  <LoaderCircle class="animate-spin" size=14/>
{/if}

<Dialog.Root bind:open={confirmationDialogOpened} closeOnOutsideClick={!saveInProgress}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{$t('common.form_completed')}</Dialog.Title>
      <Dialog.Description>
        {$t('common.form_sign_confirm_description')}
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <div class="flex flex-row items-center gap-2">
        <Button variant="outline" disabled={saveInProgress} on:click={() => confirmationDialogOpened = false}>{$t('common.cancel')}</Button>
        <Button on:click={onSave} disabled={saveInProgress}>
          <div class="flex flex-row gap-2 items-center">
            {#if saveInProgress}
              <LoaderCircle size=14 class="animate-spin"/>
            {/if}
            <span>{$t('common.save')}</span>
          </div>
        </Button>
      </div>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>