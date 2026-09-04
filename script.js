const apiUrl = 'https://script.google.com/macros/s/AKfycbz40ywmNAchPmkEhL59KNizBqdtZuECqapZHOcggZSGJt8T3xKrXPSYB0Lc6lnaaGvYNg/exec';
const pageLoader = document.querySelector('#page-loader');
const greeting = document.querySelector('#greeting');
const languageSelector = document.querySelector('#language-selector');
const languageCookieName = 'wedding-language';
const guestId = new URLSearchParams(window.location.search).get('id');
const rsvpSection = document.querySelector('#rsvp-section');
const rsvpEyebrow = document.querySelector('#rsvp-eyebrow');
const rsvpTitle = document.querySelector('#rsvp-title');
const rsvpMessage = document.querySelector('#rsvp-message');
const rsvpActions = document.querySelector('#rsvp-actions');
const rsvpStatus = document.querySelector('#rsvp-status');

const translations = {
  en: {
    pageTitle: 'Wedding invitation',
    greeting: 'Hello!',
    personalGreeting: 'Hello, {name}!',
    invitation: 'Wedding invitation',
    intro: 'This is the opening section — scroll down to discover the rest of the invitation.',
    sectionOne: 'First section',
    meetingTitle: 'Our story',
    meetingText: 'This is where a warm introduction, a personal message, or a short story about the couple can appear.',
    sectionTwo: 'Second section',
    dayTitle: 'The big day',
    dayText: 'This area is ideal for the date, ceremony location, and practical information about arriving.',
    sectionThree: 'Third section',
    celebrationTitle: 'Celebration',
    celebrationText: 'Details about dinner, the programme, and your RSVP can appear here later.',
    sectionFour: 'Fourth section',
    closingTitle: 'We hope you can join us',
    closingText: 'This final block is a lovely place for a personal note or an RSVP button.',
    rsvp: 'RSVP',
    rsvpQuestion: 'Will you celebrate with us?',
    rsvpPrompt: 'Please let us know if you will be able to join us.',
    rsvpYes: 'I’ll be there!',
    rsvpNo: 'Unfortunately, I can’t make it :(',
    responseYes: 'We are delighted that you’ll be there.',
    responseNo: 'We’re sorry you can’t make it.',
    changeToYes: 'I’m coming after all :)',
    changeToNo: 'I’m unable to attend after all :(',
    saving: 'Saving your response…',
    saved: 'Your response has been saved.',
    loadError: 'We couldn’t load this invitation. Please use the personal link we sent you.',
    submitError: 'We couldn’t save your response. Please try again.',
  },
  fil: {
    pageTitle: 'Imbitasyon sa kasal',
    greeting: 'Kumusta!',
    personalGreeting: 'Kumusta, {name}!',
    invitation: 'Imbitasyon sa kasal',
    intro: 'Ito ang pambungad na bahagi — mag-scroll pababa upang makita ang iba pang bahagi ng imbitasyon.',
    sectionOne: 'Unang bahagi',
    meetingTitle: 'Ang aming kuwento',
    meetingText: 'Dito maaaring ilagay ang isang mainit na pambungad, personal na mensahe, o maikling kuwento tungkol sa magkasintahan.',
    sectionTwo: 'Ikalawang bahagi',
    dayTitle: 'Ang malaking araw',
    dayText: 'Mainam ang bahaging ito para sa petsa, lugar ng seremonya, at mahahalagang impormasyon tungkol sa pagdating.',
    sectionThree: 'Ikatlong bahagi',
    celebrationTitle: 'Pagdiriwang',
    celebrationText: 'Maaaring ilagay dito ang mga detalye tungkol sa hapunan, programa, at kumpirmasyon ng pagdalo.',
    sectionFour: 'Ikaapat na bahagi',
    closingTitle: 'Umaasa kaming makakasama namin kayo',
    closingText: 'Ang pangwakas na bahagi ay para sa isang personal na mensahe o RSVP button.',
    rsvp: 'RSVP',
    rsvpQuestion: 'Makakasama ba namin kayo?',
    rsvpPrompt: 'Sabihin lamang kung makakadalo kayo.',
    rsvpYes: 'Darating ako!',
    rsvpNo: 'Paumanhin, hindi ako makakarating :(',
    responseYes: 'Masaya kami na makakasama namin kayo.',
    responseNo: 'Nalulungkot kaming hindi kayo makakadalo.',
    changeToYes: 'Makakadalo pa rin ako :)',
    changeToNo: 'Hindi na ako makakadalo :(',
    saving: 'Sine-save ang inyong tugon…',
    saved: 'Nai-save na ang inyong tugon.',
    loadError: 'Hindi namin ma-load ang imbitasyong ito. Gamitin ang personal na link na ipinadala namin.',
    submitError: 'Hindi namin nai-save ang inyong tugon. Pakisubukan muli.',
  },
};

let currentLanguage = 'en';
let guest = null;
let guestLookupFinished = !guestId;
let pageAssetsFinished = document.readyState === 'complete';

function revealInvitationWhenReady() {
  if (guestLookupFinished && pageAssetsFinished) {
    pageLoader.classList.add('is-hidden');
  }
}

window.addEventListener('load', () => {
  pageAssetsFinished = true;
  revealInvitationWhenReady();
}, { once: true });

function getCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
}

function saveLanguage(language) {
  document.cookie = `${languageCookieName}=${encodeURIComponent(language)}; max-age=31536000; path=/; samesite=lax`;
}

function copy() {
  return translations[currentLanguage];
}

function withName(template, name) {
  return template.replace('{name}', name);
}

function normaliseResponse(value) {
  const response = String(value || '').trim().toLowerCase();

  if (response === 'yes' || response === 'igen') {
    return 'Yes';
  }

  if (response === 'no' || response === 'nem') {
    return 'No';
  }

  return null;
}

function createRsvpButton(response, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.rsvpResponse = response;
  button.textContent = label;
  return button;
}

function renderGuest() {
  const text = copy();
  greeting.textContent = guest?.displayName
    ? withName(text.personalGreeting, guest.displayName)
    : text.greeting;

  if (!guest?.displayName) {
    return;
  }

  rsvpSection.hidden = false;
  rsvpEyebrow.textContent = text.rsvp;
  rsvpActions.replaceChildren();

  if (!guest.response) {
    rsvpTitle.textContent = text.rsvpQuestion;
    rsvpMessage.textContent = text.rsvpPrompt;
    rsvpActions.append(
      createRsvpButton('Yes', text.rsvpYes),
      createRsvpButton('No', text.rsvpNo),
    );
    return;
  }

  const isComing = guest.response === 'Yes';
  rsvpTitle.textContent = isComing ? text.responseYes : text.responseNo;
  rsvpMessage.textContent = text.rsvpPrompt;
  rsvpActions.append(
    createRsvpButton(isComing ? 'No' : 'Yes', isComing ? text.changeToNo : text.changeToYes),
  );
}

function applyLanguage(language) {
  currentLanguage = language;
  const text = copy();

  document.documentElement.lang = language === 'fil' ? 'fil' : 'en';
  document.title = text.pageTitle;

  document.querySelectorAll('[data-copy]').forEach((element) => {
    element.textContent = text[element.dataset.copy];
  });

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });

  renderGuest();
}

function selectLanguage(language, { focusGreeting = false } = {}) {
  if (!translations[language]) {
    return;
  }

  applyLanguage(language);
  saveLanguage(language);
  document.body.classList.add('language-selected');
  languageSelector.setAttribute('aria-hidden', 'true');

  if (focusGreeting) {
    greeting.focus();
  }
}

function setRsvpBusy(isBusy) {
  rsvpActions.querySelectorAll('button').forEach((button) => {
    button.disabled = isBusy;
  });
}

async function loadGuest() {
  if (!guestId) {
    guestLookupFinished = true;
    revealInvitationWhenReady();
    return;
  }

  const controller = new AbortController();
  const lookupTimeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${apiUrl}?id=${encodeURIComponent(guestId)}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    const data = await response.json();

    if (!response.ok || !data.success || !data.megszolitas) {
      throw new Error('Guest lookup failed.');
    }

    guest = {
      id: guestId,
      displayName: String(data.megszolitas),
      response: normaliseResponse(data.valasz),
    };
    renderGuest();
  } catch (error) {
    rsvpSection.hidden = false;
    rsvpEyebrow.textContent = copy().rsvp;
    rsvpTitle.textContent = copy().loadError;
    rsvpMessage.textContent = '';
    rsvpActions.replaceChildren();
  } finally {
    window.clearTimeout(lookupTimeout);
    guestLookupFinished = true;
    revealInvitationWhenReady();
  }
}

async function submitRsvp(response) {
  if (!guest || !['Yes', 'No'].includes(response)) {
    return;
  }

  setRsvpBusy(true);
  rsvpStatus.textContent = copy().saving;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        id: guest.id,
        valasz: response,
      }),
    });
    const result = await apiResponse.json();

    if (!apiResponse.ok || !result.success) {
      throw new Error('RSVP update failed.');
    }

    guest.response = response;
    renderGuest();
    rsvpStatus.textContent = copy().saved;
  } catch (error) {
    rsvpStatus.textContent = copy().submitError;
    setRsvpBusy(false);
  }
}

document.addEventListener('click', (event) => {
  const languageButton = event.target.closest('[data-language]');

  if (languageButton) {
    selectLanguage(languageButton.dataset.language, {
      focusGreeting: Boolean(languageButton.closest('#language-selector')),
    });
    return;
  }

  const rsvpButton = event.target.closest('[data-rsvp-response]');

  if (rsvpButton) {
    submitRsvp(rsvpButton.dataset.rsvpResponse);
  }
});

const savedLanguage = getCookie(languageCookieName);

if (savedLanguage && translations[savedLanguage]) {
  selectLanguage(savedLanguage);
} else {
  applyLanguage(currentLanguage);
}

loadGuest();
