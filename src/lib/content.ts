const dogFacts = [
  'Los perros pueden oler alrededor de 10,000 a 100,000 veces mejor que los humanos.',
  'El sentido del olfato de un perro es tan preciso que puede detectar ciertos c\xE1nceres y bajones de az\xFAcar en la sangre.',
  'La huella nasal de un perro es \xFAnica, como la huella dactilar humana.',
  'Los perros sudan principalmente por las almohadillas de las patas.',
  'Un cachorro reci\xE9n nacido no puede ver ni o\xEDr; abre los ojos entre los 10 y 14 d\xEDas.',
  'Los Basenjis son conocidos como \u201Cperros que no ladran\u201D, porque en vez de ladrar hacen un sonido parecido a un yodel.',
  'Los perros tienen tres p\xE1rpados, incluyendo uno extra llamado \u201Cmembrana nictitante\u201D que protege el ojo.',
  'El Galgo puede alcanzar velocidades de hasta 70 km/h.',
  'Los perros pueden aprender m\xE1s de 100 palabras y gestos si se les entrena.',
  'El sentido del tiempo de los perros est\xE1 relacionado con el olfato: pueden \u201Coler\u201D el paso de las horas por los cambios en los olores.',
  'Mover la cola no siempre significa felicidad; la direcci\xF3n e intensidad del movimiento indican emociones distintas.',
  'Los perros tienen alrededor de 1,700 papilas gustativas; los humanos tenemos cerca de 9,000.',
  'Un perro adulto tiene 42 dientes.',
  'Los perros sue\xF1an, igual que los humanos, y se cree que repasan experiencias del d\xEDa.',
  'El Chihuahua es la raza de perro m\xE1s peque\xF1a del mundo.',
  'Los perros pueden ver en la oscuridad mucho mejor que los humanos gracias a una capa reflectante en los ojos llamada \u201Ctapetum lucidum\u201D.',
  'El coraz\xF3n de un perro late entre 60 y 140 veces por minuto, dependiendo del tama\xF1o.',
  'Los perros giran en c\xEDrculos antes de acostarse, un comportamiento heredado de sus ancestros salvajes para aplastar hierba y revisar el terreno.',
  'Hay razas de perros sin pelo, como el Xoloitzcuintle, originario de M\xE9xico.',
  'Se estima que los perros fueron domesticados hace entre 15,000 y 40,000 a\xF1os, siendo de los primeros animales domesticados por el ser humano.'
]
const dogFactsEn = [
  'Dogs can smell around 10,000 to 100,000 times better than humans.',
  "A dog's sense of smell is precise enough to detect certain cancers and drops in blood sugar.",
  "A dog's nose print is unique, just like a human fingerprint.",
  'Dogs sweat mainly through their paw pads.',
  'A newborn puppy cannot see or hear and opens its eyes between 10 and 14 days old.',
  'Basenjis are known as barkless dogs because they make a yodel-like sound instead.',
  'Dogs have three eyelids, including a protective nictitating membrane.',
  'A Greyhound can reach speeds of up to 70 km/h.',
  'Dogs can learn more than 100 words and gestures with training.',
  'Dogs can smell the passage of time through changes in surrounding scents.',
  'A wagging tail does not always mean happiness; direction and intensity communicate different emotions.',
  'Dogs have around 1,700 taste buds, while humans have close to 9,000.',
  'An adult dog has 42 teeth.',
  'Dogs dream and are believed to replay experiences from their day.',
  'The Chihuahua is the smallest dog breed in the world.',
  'Dogs see much better in the dark thanks to a reflective eye layer called the tapetum lucidum.',
  "A dog's heart beats between 60 and 140 times per minute, depending on its size.",
  'Dogs circle before lying down, an inherited behavior used to flatten grass and check the ground.',
  "Some breeds are hairless, including Mexico's Xoloitzcuintli.",
  'Dogs were domesticated between 15,000 and 40,000 years ago, making them among the first domesticated animals.'
]
const animalTopicPattern =
  /\b(mascot[a-z]*|perr[a-z]*|gat[a-z]*|animal[a-z]*|cachorr[a-z]*|veterin[a-z]*|adop[a-z]*|rescat[a-z]*|refugi[a-z]*|croquet[a-z]*|aliment[a-z]*|nutric[a-z]*|vacun[a-z]*|desparasit[a-z]*|esteriliz[a-z]*|entren[a-z]*|paseos?|pasear|correas?|collares?|pulgas?|garrapatas?|bienestar animal|peluqueria canina|lomit[a-z]*|huellitas?|patitas?|cuatro patas|pet(?:s)?|dogs?|cats?|pupp(?:y|ies)|kittens?|veterinar[a-z]*|adopt[a-z]*|rescu[a-z]*|shelters?|kibble|pet care|animal health)\b/i
const clearlyUnrelatedPattern =
  /\b(criptomonedas?|bitcoin|nft|venta de (?:iphone|celular|auto|coche)|partido de futbol|futbol|politica|elecciones?|horoscopo|receta de (?:pasta|pastel|cocina)|streaming|videojuego|gaming)\b/i
function normalizePostText(body) {
  return body
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
function assessPostRelevance(body, hasImage) {
  const normalizedBody = normalizePostText(body)
  if (animalTopicPattern.test(normalizedBody)) return 'approved'
  if (clearlyUnrelatedPattern.test(normalizedBody)) return 'blocked'
  return hasImage || body.trim() ? 'review' : 'blocked'
}
export { dogFacts, dogFactsEn, normalizePostText, assessPostRelevance }
