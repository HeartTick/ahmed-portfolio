/**
 * Academic projects. Only résumé-supported facts are used; no metrics are
 * stated because none are documented. Add `links` entries only for URLs
 * that actually exist (e.g. a public repository).
 */

export type FlowStep = { label: string; detail: string };

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  badge: string;
  tagline: string;
  summary: string;
  tech: string[];
  flow: FlowStep[];
  overview: string;
  problem: string;
  approach: string[];
  highlights: string[];
  learning: string;
  disclaimer?: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "arrhythmia-classification",
    title: "IoT-Enabled Arrhythmia Classification using Deep Learning",
    shortTitle: "Arrhythmia Classification",
    badge: "Academic project",
    tagline: "ESP32 sensing, signal preprocessing and CNN classification in one workflow.",
    summary:
      "A prototype that combines ESP32-based physiological sensing, data preprocessing and CNN-based classification into an end-to-end workflow for near-real-time monitoring and prediction.",
    tech: ["Python", "CNN", "ESP32", "IoT"],
    flow: [
      { label: "ESP32 sensing", detail: "Physiological signal capture" },
      { label: "Preprocessing", detail: "Signal / data preparation" },
      { label: "CNN", detail: "Deep-learning classifier" },
      { label: "Output", detail: "Classification for monitoring" },
    ],
    overview:
      "An academic prototype for classifying heart-rhythm irregularities. It connects a hardware sensing layer built on the ESP32 with a Python analysis pipeline that preprocesses the captured data and classifies it with a convolutional neural network.",
    problem:
      "Arrhythmias are irregularities in heart rhythm. Monitoring them meaningfully requires more than a model: physiological signals have to be captured, cleaned and analysed close enough to real time for the output to be useful. The project explored how sensing and software analysis can be joined into one working flow.",
    approach: [
      "Capture physiological signals with an ESP32-based IoT sensing setup.",
      "Preprocess the captured data so it is suitable as model input.",
      "Classify the prepared signal with a CNN-based deep-learning model.",
      "Feed classification results back into a monitoring-oriented output.",
    ],
    highlights: [
      "Built the end-to-end path from the sensing hardware to the software analysis, not only the model.",
      "Combined embedded IoT sensing (ESP32) with a Python deep-learning workflow.",
      "Designed the workflow around near-real-time monitoring and prediction.",
    ],
    learning:
      "The project showed how much of an applied ML system lives outside the model itself: data capture, preprocessing and integration all decide whether a classifier is usable in a monitoring setting.",
    disclaimer:
      "Academic prototype for learning and research purposes. It is not a certified medical device and makes no clinical claims.",
    links: [],
  },
  {
    slug: "phishing-detection",
    title: "Phishing Website Detection using Machine Learning",
    shortTitle: "Phishing Detection",
    badge: "Academic project",
    tagline: "Classifying websites from URL and site characteristics.",
    summary:
      "A machine-learning workflow that classifies websites as legitimate or potentially phishing, using features extracted from website and URL characteristics.",
    tech: ["Python", "Machine Learning", "Classification"],
    flow: [
      { label: "URL / site", detail: "Raw website characteristics" },
      { label: "Features", detail: "Extraction & preparation" },
      { label: "Classifier", detail: "Trained ML model" },
      { label: "Prediction", detail: "Legitimate / potentially phishing" },
    ],
    overview:
      "A supervised classification project that decides whether a website is legitimate or potentially phishing, based on characteristics of the website and its URL.",
    problem:
      "Phishing sites imitate legitimate ones to collect credentials or personal data. Many of them leave traces in their URLs and site characteristics, which makes the problem a good fit for a feature-based classifier.",
    approach: [
      "Extract characteristics from website URLs and site properties.",
      "Prepare those characteristics as features for model training.",
      "Train a classification model on labeled examples.",
      "Evaluate how the model's predictions behave on labeled data.",
    ],
    highlights: [
      "Built the full workflow from feature preparation to training and evaluation.",
      "Framed the output as a two-class decision: legitimate or potentially phishing.",
      "Evaluated prediction behavior against labeled data instead of relying on training results alone.",
    ],
    learning:
      "Feature preparation turned out to be the core of the work: the quality of what is extracted from URLs and sites shapes what the classifier can learn.",
    links: [],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
