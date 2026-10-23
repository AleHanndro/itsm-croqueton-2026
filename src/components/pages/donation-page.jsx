"use client";

import { useEffect, useRef, useState } from "react";

import { LanguageToggle, MayaTranslationNotice, ThemeToggle, Dog, Bowl, Cloud, Paw, PawColorButton, Logo, SiteNavigation, ArrowDown, StoryImage, MoodPollCard, MemePlaceholder, CareAvatar, SmallDogMascot } from "@/components/ui";
import { chapterOneImage, chapterTwoImage, chapterThreeImage, chapterFourImage, chapterFiveImage, chapterSixImage, goalImage, errorDogImage, rejectedApplicationImage, heroDogImage, donationMemeImage, chooseFoodImage, eventDeliveryImage, checkDateImage, packAccessDogImage, recruitmentDogImage, packGenerationImage } from "@/lib/images";
import { dogFacts, dogFactsEn, normalizePostText, assessPostRelevance } from "@/lib/content";
import { useLanguage, useTheme, useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
function DonationPage() {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  return <main className="donation-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="donation-hero">
        <div className="container donation-hero-grid">
          <div className="donation-heading">
            <span className="eyebrow">{isEnglish ? "How to donate" : "C\xF3mo donar"}</span>
            <h1>{isEnglish ? "One little kibble," : "Una croquetita,"}<br /><span>{isEnglish ? "please." : "por favor."}</span></h1>
            <p>{isEnglish ? "No complicated quests here. Bring a sealed bag of dog food and help us turn an empty bowl into a happy ending." : "Aqu\xED no hay misiones complicadas. Trae una bolsa sellada de alimento y ay\xFAdanos a convertir un plato vac\xEDo en un final feliz."}</p>
          </div>
          <figure className="donation-meme">
            <span className="photo-tape photo-tape-left" />
            <span className="photo-tape photo-tape-right" />
            <img src={donationMemeImage} alt={isEnglish ? "Masked dog demanding every bag of kibble" : "Perrito enmascarado exigiendo todas las croquetas"} />
            <figcaption>{isEnglish ? "Hand over all the kibble" : "Deme todas las croquetas que tenga"}</figcaption>
          </figure>
        </div>
      </section>

      <section className="donation-guide" aria-labelledby="donation-guide-title">
        <div className="container">
          <div className="donation-guide-heading">
            <span className="chapter">{isEnglish ? "Three easy steps" : "Tres pasos sencillos"}</span>
            <h2 id="donation-guide-title">{isEnglish ? "Donate without" : "Dona sin"}<br />{isEnglish ? "getting lost." : "hacerte bolas."}</h2>
          </div>
          <div className="donation-steps">
            <article>
              <span className="donation-step-number">01</span>
              <strong>{isEnglish ? "Choose the food" : "Elige el alimento"}</strong>
              <p>{isEnglish ? "Any size of dry dog food bag helps. It must be sealed and in good condition." : "Ayuda cualquier tama\xF1o de bolsa de croquetas. Debe estar sellada y en buen estado."}</p>
              <img
    className="donation-step-image donation-step-image-food"
    src={chooseFoodImage}
    alt={isEnglish ? "Dog carefully choosing food in front of a bakery display" : "Perrito eligiendo cuidadosamente alimento frente a una vitrina"}
  />
            </article>
            <article>
              <span className="donation-step-number">02</span>
              <strong>{isEnglish ? "Check the date" : "Revisa la fecha"}</strong>
              <p>{isEnglish ? "Make sure it has not expired and that the packaging has no holes or moisture." : "Verifica que no est\xE9 caducado y que el empaque no tenga perforaciones ni humedad."}</p>
              <img
    className="donation-step-image donation-step-image-date"
    src={checkDateImage}
    alt={isEnglish ? "Dog with glasses carefully checking a bag of kibble" : "Perrito con gafas revisando cuidadosamente una bolsa de croquetas"}
  />
            </article>
            <article>
              <span className="donation-step-number">03</span>
              <strong>{isEnglish ? "Bring it to the event" : "Tr\xE1elo al evento"}</strong>
              <p>{isEnglish ? "Saturday, October 26, from 10:00 to 17:00 at the main plaza of the Higher Technological Institute." : "S\xE1bado 26 de octubre, de 10:00 a 17:00 h, en la explanada principal del Instituto Tecnol\xF3gico Superior."}</p>
              <img
    className="donation-step-image"
    src={eventDeliveryImage}
    alt={isEnglish ? "Small delivery dog carrying an orange backpack" : "Perrito repartidor llevando una mochila naranja"}
  />
            </article>
          </div>

          <div className="donation-contact">
            <div>
              <span className="chapter">{isEnglish ? "Still have questions?" : "\xBFTodav\xEDa tienes dudas?"}</span>
              <h2>{isEnglish ? "Let's talk." : "Hablemos."}</h2>
              <p>{isEnglish ? "Write to us and we'll help you prepare your donation." : "Escr\xEDbenos y te ayudamos a preparar tu donaci\xF3n."}</p>
            </div>
            <a className="button button-light donate-button" href="mailto:croqueton@tecnologico.edu.mx">
              {isEnglish ? "Send an email" : "Enviar un correo"} <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>;
}
export default DonationPage;
