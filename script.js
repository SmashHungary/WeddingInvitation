const greeting = document.querySelector('#greeting');
const toggleButton = document.querySelector('#toggle-greeting');
const languageSelector = document.querySelector('#language-selector');
const languageButtons = document.querySelectorAll('[data-language]');

const translations = {
  en: {
    pageTitle: 'Wedding invitation',
    greeting: 'Hello!',
    alternateGreeting: 'Hi!',
    invitation: 'Wedding invitation',
    intro: 'This is the opening section — scroll down to discover the rest of the invitation.',
    toggle: 'Switch greeting',
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
  },
  fil: {
    pageTitle: 'Imbitasyon sa kasal',
    greeting: 'Kumusta!',
    alternateGreeting: 'Kamusta!',
    invitation: 'Imbitasyon sa kasal',
    intro: 'Ito ang pambungad na bahagi — mag-scroll pababa upang makita ang iba pang bahagi ng imbitasyon.',
    toggle: 'Palitan ang pagbati',
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
    closingText: 'Ang pangwakas na bahaging ito ay magandang lugar para sa personal na mensahe o pindutan para sa kumpirmasyon ng pagdalo.',
  },
};

let currentLanguage = 'en';

function applyLanguage(language) {
  currentLanguage = language;
  const copy = translations[language];

  document.documentElement.lang = language === 'fil' ? 'fil' : 'en';
  document.title = copy.pageTitle;
  greeting.textContent = copy.greeting;

  document.querySelectorAll('[data-copy]').forEach((element) => {
    element.textContent = copy[element.dataset.copy];
  });
}

toggleButton.addEventListener('click', () => {
  const copy = translations[currentLanguage];
  greeting.textContent = greeting.textContent === copy.greeting ? copy.alternateGreeting : copy.greeting;
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.language);
    document.body.classList.add('language-selected');
    languageSelector.setAttribute('aria-hidden', 'true');
    greeting.focus();
  });
});
