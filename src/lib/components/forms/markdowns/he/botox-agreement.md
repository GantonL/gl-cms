---
title: 'טופס הסכמה להזרקת בוטוקס'
description: 'טופס הסכמה להזרקת בוטוקס'
date: '05.10.2024'
---
<script lang="ts">
  import SignaturePad from '$lib/components/signature-pad/signature-pad.svelte';
  import UserSignature from '$lib/components/forms/sections/user-signature.svelte';
  import UserDeclaration from '$lib/components/forms/sections/user-declaration.svelte';
  
  export let confirmed = false;
  let declaration = false;
  let signed = false;

  function onDeclerationChanged(changes: {value: boolean, state: {name: string, date: string, id: string }}) {
    declaration = changes.value;
    confirmed = declaration && signed; 
  }

  function onSignatureChanged(changes: {value: boolean, state: {name: string, date: string, signature: string }}) {
    signed = changes.value;
    confirmed = declaration && signed; 
  }
</script>
### טופס הסכמה: הזרקת בוטוקס - BOTOX (בוטוליניום טוקסין)
טיפול זה מיועד לשפר את המראה של קמטי הבעה מסוימים בפנים ופועל ע&quot;י החלשה של שרירים מסוימים
מיועד בעיקר לשמוש בחלק העליון של הפנים. לעיתים, טיפול זה מבוצע כדי לאזן את מראה הפנים אחר
אירוע של שיתוק חד צדדי של עצב הפנים, ולעיתים, כדי להחליש שרירים המתכווצים באופן בלתי רצוני,
כמו גם לעיתים לשיפור כאבי ראש.

<UserDeclaration {confirmed} on:changed={(event) => onDeclerationChanged(event.detail)}/>

הוסבר לי בע&quot;פ ובכתב כי הזרקת בוטוליניום לשרירי העפעפיים והמצח עלולה לגרום לדימום מקומי באזור
ההזרקה, שטף דם תת עורי, וכן לכאב או לתחושת &quot;שריפה&quot; מקומית וחולפת. כמו כן, הוסבר לי כי בעקבות
הזרקת הבוטוליניום עלולה להתפתח חולשה מקומית באזור ההזרקה ובשל כך לצניחת עפעפיים. פגיעה
חולפת זו, עשויה להימשך עד מספר חודשים.

הובהר לי שלעיתים, לאחר הזרקת הבוטוליניום, עלולה להופיע תחושת מחלה כשפעת, חולשה, כאבי ראש,
ואף חום הנמשכים ימים ספורים. במקרים נדירים ביותר דווח על חולשה גם באזורים מרוחקים מאזור
ההזרקה, כמו הפרעת בליעה או חולשה בגפיים.
הוסבר לי ואני מבין/ה כי קיימת אפשרות שתוך מהלך ההזרקה או זמן קצר אחריה אחוש ברע כתגובה
למתח וחרדה הקשורים בפעולה עצמה. הוסבר לי במידה וידוע לי על מחלות לב או מצב בו התרגשות יתר
עלולה לפגוע בבריאותי, יש לדווח על כך לפני ביצוע ההזרקה.
הוסבר לי כי רפואה וכירורגיה פלסטית בפרט, אינם מדע מדויק, וכי לא ניתן למנוע לחלוטין סיבוכים ותוצאות
לא רצויות. המנתח מתחייב לטפל במסירות בכל סיבוך או תוצאה לא רצויה. אולם, הובהר לי כי לא יינתן
זיכוי כספי משום סוג, בשל סבוך או תוצאה לא רצויה לאחר הטיפול. כמו כן, לא יכוסו כל נזק כספי או אחר
שיגרם בקשר לטיפול כמו אובדן ימי עבודה, רכישת תרופות, נסיעות מיוחדות, אשפוז, ו/או כל נזק ישיר או
עקיף שייגרם בהקשר ישיר או עקיף לתוצאות הטיפול אותו אעבור.
<UserSignature {confirmed} on:changed={(event) => onSignatureChanged(event.detail)}/>
