# Arabic review notes (Hebrew vs Arabic proofread, 2026-11-16)

Reviewers: 4 AI proofreaders, one per chunk of the 762 units. Not a native human review.

Applied fixes are already in the code and in `methodica-math-proportion-01_target-01_ar.xlf`. Below: items NOT applied.


## Judgment calls (decide, then apply everywhere)

- `01-00-09-001` — Also 01-00-09-002, 01-00-10-001. Hebrew "תותים" = strawberries; Arabic "التوت" means berries/mulberries. Consider "الفراولة" (e.g. "نبدأ بالفراولة", "كمية الفراولة", "كميات الفراولة") but first check which word the recipe table/images use and keep it identical everywhere.
- `01-00-13-001` — "شراب الميبل" is a loanword, understandable and used consistently (also 13-002, 15-xxx). Standard Arabic is "شراب القيقب"; keep "الميبل" only if the table/image uses it.
- `01-00-08-001` — "إذا اختزلنا بـ 4" (also 09-001, 21-009 "بـ 2") is a calque of "ב-4"; 18-006 says "بواسطة القسمة على 2". Consider "إذا اختزلنا بالقسمة على 4" / "اختزلنا على 4" and use one phrasing everywhere.
- `01-00-14-001` — Arabic has an extra comma and a space before <br> ("...الميبل، <br>") that the Hebrew and sibling rows 10-001 / 12-001 do not have. Harmless; remove "، " for consistency if desired.
- `01-00-18-001` — "اختاروا النسبة التي تتناسب مع 3 : 7" drops the word "ratio" before the span (Hebrew "ליחס"). Option: "اختاروا النسبة التي تتناسب مع النسبة 3 : 7" (span unchanged).
- `01-00-19-004` — Also 01-00-28-004. "לחיזוק" (reinforcement/extra support) is rendered "للتوضيح" (clarification). Understandable, but "للدعم" or "للمساعدة" is closer to the Hebrew meaning.
- `01-00-02-001` — "نتعلّم عن التناسُب" is an English/Hebrew-style "learn about"; MSA prefers "نتعلّم التناسب" or "نتعرّف على التناسب".
- `01-00-04-001` — "سنبدأ بالتمرين بعد قليل" can be read as "start with THE exercise", which collides with the next line ("let us solve one exercise together"). Option: "سنبدأ بالتمرّن بعد قليل" / "سنبدأ التدرّب بعد قليل".
- `01-00-23-002` — "كانت في الفصل الأول ثلاثة امتحانات" - with a number-phrase subject the preceding verb is normally masculine: "كان في الفصل الأول ثلاثة امتحانات في الرياضيات" (or "أُجري في الفصل الأول ثلاثة امتحانات").
- `01-00-24-005` — Also 24-008, 24-011, 24-014. "و-16 خرزة" keeps the Hebrew hyphen after the conjunction; Arabic normally writes "و16 خرزة" (or "و 16"). Also note the source says "שרשרת" (necklace) while the task says "צמיד"; Arabic "سوار" is consistent with the task.
- `01-00-24-002` — "عرض موسيقي" / "ألوان العرض" for "הופעת מוזיקה" / "צבעי המופע": "حفل موسيقي" / "ألوان الحفل" is the more idiomatic Arabic for a concert. Acceptable as is.
- `01-00-25-002` — (1) "طبق بيتزا" for "מגש פיצה": Israeli Arabic usually says "صينية بيتزا". (2) The Hebrew money span shows the symbol "₪72"; Arabic has the words "72 شيكل" inside the span. Formally the numeral after 11+ takes an accusative singular ("72 شيكلًا"). Check it matches how the table prints amounts (symbol vs word).
- `01-00-29-005` — Equality of two ratios is "مساواة بين نسبتين" here and in 15-002 ("تحقق المساواة") but "تَساوٍ بين نسبتين" in 22-002 and 23-002. Unify (suggest "تَساوٍ" or "مساواة" everywhere).
- `01-00-22-007` — Punctuation: Arabic adds a dash and a question mark ("وافحصوا – هل نحصل على نسب متساوية؟") where the Hebrew has a plain statement; same in 23-007 and 24-019. 20-006 and 21-006 use plain statements. Consider one pattern.
- `01-00-26-003` — Alt text "تطبيق نسبة الصورة على الشاشة" can be read as "applying the image ratio to the screen". "יישומון" is a small interactive applet: consider "أداة (تطبيق مصغّر) لنسبة الصورة على الشاشة".
- `01-00-24-022` — "ولا تتناسب مع باقي الأساور" is fine; "ولا يوجد بينه وبين باقي الأساور تناسب" would mirror the term used in the rest of the unit.
- `01-00-30-002` — Arabic "المعادلات" (equations) for Hebrew "שוויונות" (numeric equalities). Not wrong enough to force, but "أي من التساويات التالية تصف تناسبًا؟" (or "أي من المساواتات") is closer to the source term "مساواة" used elsewhere in the unit.
- `01-00-30-007` — Item letters: unit maps א/ב/ג/ד to أ/ب/ت/ث (hijā'ī order; see "في البند ث" here and "ت." in 01-00-36-002). Israeli Arabic school/Bagrut materials normally use the abjad order أ، ب، ج، د. Suggest "في البند د" and "ج." if the project convention allows; must be changed everywhere at once or not at all.
- `01-00-31-002` — פטל = raspberry. "التوت" (berry/mulberry) is used throughout (شراب التوت المركّز, عصير التوت). More precise: "توت العليق" (e.g. "بنكهة توت العليق"). Consistent usage across the unit; change globally or leave.
- `01-00-31-002` — "تظهر طريقة التحضير الموصى بها" and "التعليمات الظاهرة على القنينة" are slight calques of "כתוב"/"על הבקבוק". Alternatives: "مكتوب على قنينة ... طريقة التحضير الموصى بها" and "المكتوبة على القنينة". Same text in 01-00-32-002.
- `01-00-33-002` — Trailing space inside <strong>3 ملاعق من اللون الأحمر </strong>مع: renders identically; could be moved outside the tag (…الأحمر</strong> مع). Cosmetic.
- `01-00-33-008` — "حاولوا تغيير عدد الملاعق" for "נסו לשנות": "جرّبوا تغيير عدد الملاعق" is more idiomatic. Also "وعاء" for קערה is fine ("صحن"/"طبق" also possible).
- `01-00-34-002` — "عناصر التقوية" for חיזוקים (power-ups): gaming Arabic usually says "تعزيزات" ("نوعين من التعزيزات"). Same phrase in 01-00-35-002 and 01-00-36-002. Also "لعبة سباق سيارات" -> "لعبة سباقات السيارات" is slightly more idiomatic.
- `01-00-36-008` — "نلائِم لكل مرحلة كمية قشور الموز" for "נתאים לכل שלב": "نُلائم" is stiff; alternative "نُقابل كل مرحلة بكمية قشور الموز التي جُمعت فيها ونكتبها في المقام".
- `01-00-38-001` — "تمرين قياسي ب" for "תרגול סטנדרטי ב׳": "תרגול" is closer to "تدريب"; "قياسي" is acceptable as a fixed label. Check against how chunk 1 / the section title renders "תרגול סטנדרטי א׳" so the pair stays consistent.
- `01-00-38-002` — "راديو 106FM هو راديو تعليمي" -> more natural "إذاعة 106FM هي إذاعة تربوية" (חינוכי = تربوي). "بلاي ليست" in brackets is fine.
- `01-00-38-003` — Image caption "مذيعان شباب" (dual = exactly two) for "שדרנים צעירים" (plural). If the picture shows more than two people use "مذيعون شباب في استوديو إذاعي" ("استوديو" is the MSA spelling of "ستوديو").
- `01-00-39-002` — שואב-שוטף is a vacuum-and-wash floor machine (used with water + cleaning liquid). "مكنسة كهربائية" (plain vacuum) loses the washing function that makes the water/cleaning-liquid ratio meaningful. Suggest "مكنسة كهربائية شافطة وغاسلة" (also in caption 01-00-39-003).
- `01-00-39-002` — Unit abbreviation "(ملل)" for מ"ל: the standard Arabic abbreviation for millilitre is "مل" ("ملل" also means boredom). Suggest "(مل)". Left unchanged because some Israeli Arabic materials use "ملل".
- `01-00-37-002` — "سهل عليكم!" for idiom "קטן עליכם!" is OK; livelier alternative "ستنجحون بسهولة!" or "هذا سهل عليكم!". Pure style.
- `01-00-39-004` — مل/ملل: "ملل" also means boredom in Arabic; the standard abbreviation of milliliter is "مل". Used consistently in this chunk (39-004, 39-014, 40-002, 40-010), so left as is; consider "مل" project-wide.
- `01-00-39-014` — "بعد الاختزال بـ 20" is a Hebrew calque; more idiomatic: "بعد الاختزال على 20" or "بقسمة الطرفين على 20" (also 40-010 "بـ 25"). Also "أي، مقابل" -> "أي أنه مقابل" (no comma after أي).
- `01-00-40-002` — שואב-שוטף (vacuum + washer) rendered only "مكنسة كهربائية" (also 40-003): "שוטף" (washing) is lost. Suggest "مكنسة كهربائية غاسلة" or "مكنسة شفط وغسل". Also "مرشد المجموعة" for "מדריך השבט": scouting term would be "مرشد الفوج/الفرقة"; acceptable as is.
- `01-00-41-001` — "كل الاحترام" (also 01-00-52-001) is a calque of "כל הכבוד"; MSA equivalent "أحسنتم!" (or "أحسنتَ/أحسنتِ!" since the Hebrew is singular).
- `01-00-42-003` — "ما هي الأدوات المطلوبة؟" is fine; closer to Hebrew: "ماذا تحتاجون؟".
- `01-00-44-002` — "تقدمنا في المستوى" is awkward for "עלינו רמה": suggest "انتقلنا إلى مستوى أعلى!".
- `01-00-45-002` — "وتيرة النمو" for "קצב הגדילה" is OK; "معدل النمو" is the usual maths/biology term. Left as is.
- `01-00-46-002` — "(سبرينترز)" is an English plural transliteration; alternative "(عدّائو السرعة)" or "(سبرنتر)". Also a stray space before <br> after "نوعين:" (harmless; same in 47-002).
- `01-00-47-002` — "المدرب الرئيسي" for "המאמן הבכיר" is fine; "المدرب الأول" also possible.
- `01-00-49-005+1` — HIIT term: "تدريب فترات عالي الشدة" is understandable; standard Arabic is "التدريب المتقطع عالي الشدة" / "تدريب الفواصل عالي الشدة".
- `01-00-49-013` — "مرفق في الجدول النسب ..." (also 49-015): "مرفق" does not agree with plural النسب and sounds like an attachment. Suggest "يعرض الجدول النسب بين زمن العمل وزمن الراحة في كل تمرين، ونوع التدريب الملائم لهذه النسبة".
- `01-00-50-002` — "معطى المثلثان التاليان": dual subject, so "معطيان" or rephrase "المثلثان المعطيان (الأطوال بالسنتيمتر)". Hebrew does not say "التاليان".
- `01-00-50-003` — "الضلع الملائم له" for "הצלע המתאימה לו": geometry term is "الضلع المناظر له" (the base corresponding to that height); also 50-006.
- `01-00-52-002` — "السؤال الأكبر" (also 01-00-54-001 "السؤال الأكبر – بند أ") for "שאלת השיא" reads as "the biggest question". Suggest "سؤال القمة" (or "السؤال الأصعب"). Keep one wording project-wide.
- `01-00-53-001` — "المزدحم" for "צפוף" (population density context): "المكتظ" is more precise. "يتواجد"/"المتواجدين" (also 53-003) are calques; "يوجد"/"الموجودين" preferred in MSA.
- `01-00-53-005` — Hebrew gives the abbreviation קמ"ר (קילומטר ריבועי); Arabic drops it. If the data table uses the abbreviation, add "(كم²)" or equivalent.
- `01-00-54-006` — "ما إذا تم الحفاظ على النسب" is a calque of "נשמרים"; clearer: "ما إذا كانت النسبة بين عددي السكان مساوية للنسبة بين المساحتين".
- `01-00-40-001` — "تمرين قياسي" for "תרגול סטנדרטי": "قياسي" often means "record" (رقم قياسي); "تمرين معياري" or "تمرين عادي" avoids ambiguity. Check against the agreed unit terminology.
- `01-00-58-001` — GLOBAL (also 01-00-56-001, 01-00-60-001, 01-00-99-018..021, -054..057, -090..095): item/option letters are mapped to hijai order أ ب ت ث ج ح. Israeli Arabic school/bagrut materials normally number items with abjad order أ ب ج د هـ و (Hebrew ג=ج, ד=د, ה=هـ, ו=و). Currently "بند ت" / "الإمكانية ث" etc. Recommend deciding project-wide (all chunks) and, if changed, apply everywhere incl. cross-references such as "الإمكانية ب".
- `01-00-56-001` — "السؤال الأكبر" for "שאלת שיא" (peak/challenge question) reads as "the biggest question". Consider "سؤال التحدّي" or "سؤال القمّة" (also ids 01-00-58-001, 01-00-60-001). Check how other chunks render it.
- `01-00-56-007` — "بنفس مُعامل المساحة" is stiff/technical. More natural: "بنفس عدد المرات التي تتغيّر بها المساحة" (note consistent with "بـ 2.5 مرة" in 01-00-56-010).
- `01-00-99-110` — Hebrew "{value} יתקבל גוון זהה" has {value} as an adverbial/condition (e.g. "with X..."), while Arabic "{value} سيعطي نفس درجة اللون" makes it the grammatical subject. Verify what {value} contains; if it is a clause like "عند ..." the Arabic must be restructured, e.g. "{value}: سنحصل على نفس درجة اللون في الخليطين".
- `01-00-99-129` — "شراب الميبل" for maple syrup: MSA/standard term is "شراب القيقب" (also ids 01-00-99-121, -132). "الميبل" is understandable; choose one and keep consistent.
- `01-00-99-113` — "מנות" translated "وجبات" (meals). For recipe servings "حصص" is more precise (e.g. "4 حصص"); "وجبات" is acceptable and used consistently (ids 112-114, 129, 133, 134, 142, 143, 144) - only change globally if desired.
- `01-00-58-006` — Locality name "ברקת" -> "بركات" reads as the ordinary Arabic word "barakat" (blessings). If a transliteration is intended: "بَرَقَت"/"بارقت". Other localities: غفعوت, نئوت, شاكيد are fine.
- `01-00-99-088+2` — Across the unit "אפשרות" is rendered "إمكانية" (5, 11, 40, 98). "خيار/خيارات" (e.g. "خيارات الإجابة") is the more natural UI wording, if you want to change it globally.
- `01-00-99-087` — "هل يمكنني الحصول على تلميح؟" (Is there any hint?) vs Hebrew "אפשר רמז?" (May I have a hint?). Alternative: "هل يمكنني الحصول على تلميح؟" or shorter "أريد تلميحًا".
- `01-01-99-020+5` — "בטוח לסגור את החלון?" = "Sure you want to close?"; Arabic "هل تريدون إغلاق النافذة فعلًا؟" is acceptable; closer: "هل أنتم متأكدون من إغلاق النافذة؟".
- `01-01-03-018` — Alt text: "מאזניים" = "ميزان ذو كفتين" (balance scale) and "כפיות" = teaspoons "ملاعق صغيرة"; current "ميزان عليه ملاعق" is acceptable.
- `01-00-99-142` — "دون التأثير على الطعم أو القوام" for "מבלי לפגוע" (without harming): "دون المساس بالطعم أو القوام" / "دون الإضرار" is closer. Acceptable as is.
- `01-01-99-001` — "רכיב" -> "الجزء" (also 02-06-99-001). "المكوّن" would be the literal term; fine if "الجزء" is a project decision.
- `01-01-00-004` — "נכון ל-2026" -> "معطيات من عام 2026"; closer: "حتى عام 2026" (also 01-01-00-006).
- `01-01-03-013` — Arabic writes "وَ 6" (with fatha and a space) whereas elsewhere "و16" / "و20" has no diacritic or space; harmless but inconsistent.
- `01-00-57-001` — Emphasis scope: Hebrew bolds "טענו כי ..." (verb included); Arabic keeps the verb "ادّعى" outside <strong>. Fine; if exact scope is wanted use "منظّمو المهرجان <strong>ادّعوا أن الميزانية وُزعت ...</strong>".
- `01-00-99-144` — Also "تتعلّق بنوع وهدف التدريب" could read better as "تعتمد على نوع التدريب وهدفه".

## Problems in the Hebrew source (Arabic copies them; math not changed)

- `01-00-22-007` — Also 01-00-22-010. The task asks for the ratio points : minutes (30:40 and 27:36 reduce to 3 : 4), but the explanation states the reduced ratio as 4 : 3 (minutes : points). Order of terms is reversed in the Hebrew; Arabic follows the Hebrew (4 : 3) so both languages are wrong together.
- `01-00-25-008` — David ate 3 slices and Rafael 5, so the ratio Dawid : Rafael is 3 : 5, but the Hebrew explanation says 5 : 3. Arabic copies it (أديب 3 / أشرف 5, "5 : 3").
- `01-00-24-005` — Also 24-008, 24-011, 24-014 vs 24-022. Bead counts given (Shani 8:16, Keren 12:24, Dafna 10:10, Carmel 10:20 = 1:2, 1:2, 1:1, 1:2) do not match the explanation (Shani/Keren/Carmel reduce to 2 : 3, Dafna is 3 : 2). Either the captions or the explanation is out of sync with the image. Arabic reproduces both as written.
- `01-00-24-005` — Hebrew calls the items "שרשרת" (necklace) in the captions but "צמיד" (bracelet) in the task and explanation.
- `01-00-13-001` — Minor wording: "היחס בין שני המתכונים הוא 3 : 12" - it is the ratio between the syrup quantities of the two recipes, not between the recipes.
- `01-00-32-002` — Tense inconsistency vs 01-00-31-002: here "גל רוצה להכין" (present) but there "גל רצתה להכין" (past). Arabic uses past "أرادت" in both, which is fine.
- `01-00-33-002` — Hebrew "אלו מהתלמידים ערבב" - "אלו" should be "אילו" (as in 01-00-30-002), and plural subject with singular verb ("ערבב"/"ערבבו"). Arabic singular "أيٌّ من الطلاب خلطَ" is correct for the intended multi-select.
- `01-00-32-009` — Odd phrase "הטעם של הפטל של גל" (the raspberry taste of Gal); probably meant "הטעם של המיץ של גל". Arabic rendered it sensibly as "طعم عصير التوت الذي حضرته لينا".
- `01-00-34-005` — Missing object marker: "יחס כותבים" should be "את היחס כותבים".
- `01-00-38-011` — Minor wording difference from 01-00-38-013: 011 reads "מתקבל 3 : 1" while 013 reads "מתקבל היחס 3 : 1". Arabic has "النسبة" in both, so no action needed.
- `01-00-40-002` — Manufacturer rule is 4 L water : 20 mL cleaner = 4,000 : 20 = 200 : 1 (water : cleaner). The text says the reduced ratio water : cleaner "צריך להיות 1 : 200", which is reversed (that is cleaner : water). 01-00-40-010 correctly uses 5,000 : 25 -> 200 : 1, and 39-014 shows 1 : 200 as cleaner : water. Arabic copies the Hebrew faithfully, so the fix belongs in the source: 200 : 1 (or swap the order of the terms).
- `01-00-44-001` — "הגענו ל-4 שאלות של תרגול מתקדם" but all advanced-practice headings say "שאלה X מתוך 5" (questions 1-5 in 01-00-45/46/47/49/50/51). Should be 5.
- `01-00-54-002` — Uri claims population "גדול בקירוב פי 8" and area "בקירוב רק פי 4", but the data used by Daniel give 1,060,000/285,000 = about 3.7 (approx. 4) and 126/67 = about 1.9 (approx. 2). Density ratio 2 is right, but 8 and 4 should be 4 and 2. Also Daniel's "ובצמצום: 8,413 ≠ 4,254" is a division (per km2), not a reduction (צמצום).
- `01-00-58-010` — 700,000/150,000 = 4.666... so "בערך 4.66" should be 4.67 when rounded to 2 places (or "כ-4.7"). Arabic mirrors "4.66".
- `01-00-99-130` — Maple syrup quantity in the 12-serving column is "12 כפות" (01-00-99-123) while the 4-serving recipe has 3 כפות (01-00-99-132): 3x3 would be 9, so syrup is NOT proportional (strawberries 2->6, yogurt 1->3 are x3). Likely an intentional distractor for the "is there proportion" question, but 01-00-99-142 says Roni kept proportion - confirm intent.
- `01-00-54-009` — 1,060,000/126 is about 8,413 and 285,000/67 about 4,254 (ratio about 1.98), i.e. very close to double; the claim "not 2x" is true but only just - check this is the intended numbers (could confuse learners).

## Name mapping seen (check for collisions)

- רוני → رنين (`01-00-06-001`)
- נועה → يارا (`01-00-26-002`)
- דני אבדיה → ديني أفديا (`01-00-22-002`)
- לאו מסי → ليو ميسي (`01-00-20-002`)
- שני → نسرين (`01-00-24-003`)
- קרן → سمر (`01-00-24-006`)
- דפנה → عبير (`01-00-24-009`)
- כרמל → منال (`01-00-24-012`)
- דוד → أديب (`01-00-25-002`)
- רפאל → أشرف (`01-00-25-002`)
- בית ספר "אלונים" → مدرسة "أجيال" (`01-00-23-002`)
- גל → لينا (`01-00-31-002`)
- רועי → تامر (`01-00-33-002`)
- חן → حنان (`01-00-33-004`)
- אורי → أمل (`01-00-33-005`)
- אביב → ساهر (`01-00-33-006`)
- תום → أمجد (`01-00-33-007`)
- ליאור → شادي (`01-00-39-002`)
- הילי → عبير (`01-00-39-002`)
- גל → وائل (`01-00-40-002`)
- אורי → أمل (option label 01-00-54-003 written امل, fixed) (`01-00-54-002`)
- דניאל → عماد (`01-00-54-002`)
- נעה → لينا (`01-00-99-028`)
- דניאלה → خلود (`01-01-03-005`)
- אריאל → عماد (`01-01-03-005`)
- אלונים (school) → أجيال (`01-01-03-001`)
- גבעות (locality) → غفعوت (`01-00-58-003+1`)
- נאות (locality) → نئوت (`01-00-58-004+1`)
- שקד (locality) → شاكيد (`01-00-58-005+1`)
- ברקת (locality) → بركات (`01-00-58-006+1`)

## Decisions taken after the review (2026-11-17)

- Check button label: **هل إجابتي صحيحة؟** (not shortened). Hint button label: **هل يمكنني الحصول على تلميح؟**. The hint button sits at `left: 264px` so the two buttons never overlap.
- Dog breeds: داكسهند، لابرادور، الراعي البلجيكي، بينشر، بوردر كولي (applet, screens and metadata agree).
- Report-button label on hover is one line; the screen-14 table fits its frame with no horizontal scrollbar.

## Common fixes - re-run after any text change

1. Walk all 60 screens in headless Chrome (call goTo on each) and check: JS errors, Hebrew letters in the rendered text, overlapping buttons, scroll containers wider than their frame. Arabic is wider than Hebrew, so overlaps and clipping are the usual regression.
2. Labels must not wrap or collide: the flag label is one line (`.flag-btn-label` nowrap, absolute), the hint button sits at `left: 264px`, table cells in `.g-media .g-table` use 8px side padding, `.g-right` has `overflow-x: hidden` (the unit forbids horizontal scrollbars). Never shorten a label to fix this - fix the layout.
3. Number-noun agreement: 3-10 take the plural (4 لترات، 5 شواقل); dual is "بسطَي", not "بسطَيّ".
4. Metadata answers, ids and response patterns must equal the displayed Arabic text exactly, because the xAPI layer reports the DOM text.
5. Names were localised per story - the same Hebrew name can map to different Arabic names in different stories (see the name list above).
6. Text inside images and applets is not in the XLIFF: re-check `unit-assets/` whenever media changes (images were repainted via Chrome canvas).
7. The last screen of each component greys its button after the last click by design; to walk into the next component locally, open `index_dev.html?dev=1`.
8. Tests in `_test/` assert on Arabic UI strings; jsdom is not installed here, so they have not been run.
9. Font stack is `Calibri, Carlito, 'Assistant', sans-serif` (the applets start with `Calibri, Carlito` too); Noto Sans Arabic is bundled for the Arabic glyphs.

## Last checklist run - 2026-11-17

All 9 items pass.
- 1: 60 screens, 0 JS errors, 0 Hebrew in rendered text, 0 overlapping buttons, 0 scroll containers wider than their frame; xlf tag sequences equal the Hebrew in all 762 units.
- 2: hint button at 264px, flag label one line, table and `.g-right` fixes in place; the only wrapped buttons are the speech bubble (03-39) and the true/false pills (05-50), same as in Hebrew.
- 3: no 3-10 + singular noun left in code, metadata or applets; no wrong duals.
- 4: the answers sent to the platform match the metadata in the same way as in Hebrew (28 of 34 questions match exactly; the other 6 differ only in format, identically in Hebrew).
- 5: no name collisions inside one story. A name reused across stories: عبير (דפנה and הילי), عماد (אריאל and דניאל).
- 6: no Hebrew outside comments in html/js/css/json (only in test fixtures); 5 applets and 25 images re-checked; the 9 character videos are not checked for text.
- 7: `?dev=1` routing from the last screen of each component goes to the same page as in Hebrew.
- 8: jsdom installed in `C:/lomda-test`; verify-assets 361, verify-report 790, statement-flow 290, true-false 46, write-guard 75 - all green. `mutations.js` and `monday-2026-10-07.js` (needs puppeteer) were not run.
- 9: every font-family declaration starts with Calibri; Arabic font file present and declared.
- Screen 44 now says 5 questions in the xlf too (the code already did; the old xlf said 4).
