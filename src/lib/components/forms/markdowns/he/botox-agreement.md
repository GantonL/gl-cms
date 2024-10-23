---
title: 'טופס הסכמה להזרקת בוטוקס'
description: 'טופס הסכמה להזרקת בוטוקס'
date: '05.10.2024'
---
<script lang="ts">
  import SignaturePad from '$lib/components/signature-pad/signature-pad.svelte';
  import PatientSignature from '$lib/components/forms/sections/patient-signature.svelte';
  import DoctorSignature from '$lib/components/forms/sections/doctor-signature.svelte';
  import UserDeclaration from '$lib/components/forms/sections/user-declaration.svelte';
  import GenericText from '$lib/components/forms/sections/generic-text.svelte';
  import {createEventDispatcher} from 'svelte';

  export let confirmed = false;
  let declaration = false;
  let signed = false;
  let doctorSigned = false;
  let areas = false;
  const dispatch = createEventDispatcher();

  function onDeclerationChanged(changes: {value: boolean, state: {name: string, date: string, id: string }}) {
    declaration = changes.value;
    confirmed = declaration && signed && areas && doctorSigned;
    dispatch('confirmed', confirmed);
  }

  function onSignatureChanged(changes: {value: boolean, state: {name: string, date: string, signature: string }}) {
    signed = changes.value;
    confirmed = declaration && signed && areas && doctorSigned;
    dispatch('confirmed', confirmed);
  }

  function onDoctorSignatureChanged(changes: {value: boolean, state: {name: string, date: string, signature: string }}) {
    doctorSigned = changes.value;
    confirmed = declaration && signed && areas && doctorSigned;
    dispatch('confirmed', confirmed);
  }

  function onAreasChanged(changes: {value: boolean, state: {value: string}}) {
    areas = changes.value;
    confirmed = declaration && signed && areas && doctorSigned;
    dispatch('confirmed', confirmed); 
  }
</script>
### טופס הסכמה: הזרקת בוטוקס - BOTOX (בוטוליניום טוקסין)
טיפול זה מיועד לשפר את המראה של קמטי הבעה מסוימים בפנים ופועל ע&quot;י החלשה של שרירים מסוימים
מיועד בעיקר לשמוש בחלק העליון של הפנים. לעיתים, טיפול זה מבוצע כדי לאזן את מראה הפנים אחר
אירוע של שיתוק חד צדדי של עצב הפנים, ולעיתים, כדי להחליש שרירים המתכווצים באופן בלתי רצוני,
כמו גם לעיתים לשיפור כאבי ראש.

<UserDeclaration {confirmed} on:changed={(event) => onDeclerationChanged(event.detail)}/>

אני מצהיר/ה בזה שקיבלתי הסבר מפורט על הזרקת בוטוליניום טוקסין A כטיפול קוסמטי רפואי בקמטים
באזורים: <GenericText {confirmed} on:changed={(event) => onAreasChanged(event.detail)}/>. על התוצאות המקוות,
על הסיכונים ועל דרכי הטיפול החלופיות האפשריות לרבות הסיכויים והסיכונים בכל אחד מהליכים אלה. אני
נותן/ת בזאת את הסכמתי לביצוע הפעולה.

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

<PatientSignature {confirmed} on:changed={(event) => onSignatureChanged(event.detail)}/>

אני מאשר/ת כי הסברתי למטופל/ת את כל האמור לעיל בפרוט הדרוש וכי החתימה בוצעה לאחר
ששוכנעתי כי הסברי הובנו במלואם.

<DoctorSignature {confirmed} on:changed={(event) => onDoctorSignatureChanged(event.detail)}/>