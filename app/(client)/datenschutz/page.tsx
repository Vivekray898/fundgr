// app/(client)/datenschutz/page.tsx
import React from "react";
import Container from "@/components/Container";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Building, ExternalLink, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Datenschutzerklärung - FundGrube BestPreis",
  description: "Unsere Datenschutzerklärung. Informationen über die Verarbeitung Ihrer personenbezogenen Daten auf unserer Website.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const PrivacyPage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-6 md:py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-3 md:px-0">
          {/* Header - Mobile Optimized */}
          <div className="mb-6 md:mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 mb-3 md:mb-4">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Datenschutzerklärung
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
              Stand: Januar 2024
            </p>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-10 space-y-6 md:space-y-8">
              {/* 1. Datenschutz auf einen Blick */}
              <section>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-blue-600 text-sm md:text-base">1.</span> Datenschutz auf einen Blick
                </h2>
                
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 mb-1.5 md:mb-2">Allgemeine Hinweise</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                </p>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 mb-1.5 md:mb-2">Datenerfassung auf unserer Website</h3>
                <div className="space-y-2.5 md:space-y-3">
                  <div>
                    <p className="font-medium text-gray-700 text-xs md:text-sm">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
                    <p className="text-xs md:text-sm text-gray-600">Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-xs md:text-sm">Wie erfassen wir Ihre Daten?</p>
                    <p className="text-xs md:text-sm text-gray-600">Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular oder bei der Newsletter-Anmeldung eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-xs md:text-sm">Wofür nutzen wir Ihre Daten?</p>
                    <p className="text-xs md:text-sm text-gray-600">Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens oder zur Bearbeitung Ihrer Anfragen verwendet werden.</p>
                  </div>
                </div>
              </section>

              {/* 2. Verantwortliche Stelle */}
              <section>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-blue-600 text-sm md:text-base">2.</span> Verantwortliche Stelle
                </h2>
                <div className="bg-blue-50 rounded-xl p-4 md:p-6 space-y-3 border border-blue-100">
                  <p className="font-semibold text-gray-800 text-base md:text-lg">Fundgrube Sonderpostenmarkt &amp; Best Preis</p>
                  <div className="space-y-2 text-gray-700 text-xs md:text-sm">
                    <p className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
                      <span className="font-medium">Inhaber / Ansprechpartner:</span>
                      <span>Herr Harinder Singh</span>
                    </p>
                    <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
                      <span className="font-medium">Standorte:</span>
                      <div className="text-xs md:text-sm">
                        <p><strong>Blieskastel:</strong> Saar-Pfalz-Straße 2b, 66440 Blieskastel</p>
                        <p><strong>Zweibrücken:</strong> Fruchtmarktstraße 1, 66482 Zweibrücken</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
                      <span className="font-medium">Kontakt:</span>
                      <span className="flex flex-col gap-1 text-xs md:text-sm">
                        <a href="tel:+4968039943760" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 break-all">
                          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" /> +49 680 39943760
                        </a>
                        <a href="mailto:fundgrube6@gmail.com" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 break-all">
                          <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" /> fundgrube6@gmail.com
                        </a>
                        <a href="https://fundgrube-bestpreis.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 break-all">
                          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" /> www.fundgrube-bestpreis.de
                        </a>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-blue-200">
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                  </p>
                </div>
              </section>

              {/* 3. Datenerfassung und Funktionen */}
              <section>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-blue-600 text-sm md:text-base">3.</span> Datenerfassung und Funktionen auf unserer Website
                </h2>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 mb-1.5 md:mb-2">Server-Log-Dateien</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc pl-5 md:pl-6 mt-1.5 md:mt-2 space-y-0.5 md:space-y-1 text-xs md:text-sm text-gray-600">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
                <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-3">
                  Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
                </p>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 md:mt-6 mb-1.5 md:mb-2">Kontaktformular</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                </p>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 md:mt-6 mb-1.5 md:mb-2">Newsletter-Daten</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Wenn Sie den auf der Website angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse sowie Informationen, welche uns die Überprüfung gestatten, dass Sie der Inhaber der angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind (Double-Opt-In-Verfahren).
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2 break-words">
                  Die Erteilung Ihrer Einwilligung zur Speicherung der Daten, der E-Mail-Adresse sowie deren Nutzung zum Versand des Newsletters können Sie jederzeit widerrufen, etwa über den „Austragen“-Link im Newsletter oder per Nachricht an <a href="mailto:fundgrube6@gmail.com" className="text-blue-600 hover:text-blue-700 break-all">fundgrube6@gmail.com</a>.
                </p>
              </section>

              {/* 4. Einbindung von Diensten */}
              <section>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-blue-600 text-sm md:text-base">4.</span> Einbindung von Diensten und Inhalten Dritter
                </h2>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 mb-1.5 md:mb-2">WhatsApp-Kontaktbutton</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Auf unserer Website ist eine Schaltfläche des Dienstes WhatsApp (Meta Platforms Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland) eingebunden. Das Klicken des WhatsApp-Buttons leitet Sie direkt zu WhatsApp weiter. Dabei können Daten (wie Ihre IP-Adresse und Informationen über Ihren Besuch auf unserer Seite) an WhatsApp oder Meta in den USA übertragen werden. Diese Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO oder unseres berechtigten Interesses an einer schnellen Kommunikation (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2 break-words">
                  Weitere Informationen finden Sie in der Datenschutzerklärung von WhatsApp:{' '}
                  <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 break-all">
                    https://www.whatsapp.com/legal/privacy-policy
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </p>

                <h3 className="text-base md:text-lg font-semibold text-gray-800 mt-4 md:mt-6 mb-1.5 md:mb-2">YouTube-Videos</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Unsere Website bettet Videos von der YouTube-Website ein. Betreiber der Website ist Google Ireland Limited („Google“), Gordon House, Barrow Street, Dublin 4, Irland.
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2">
                  Wenn Sie unsere Seiten mit eingebetteten YouTube-Videos besuchen, wird eine Verbindung zu den Servern von YouTube hergestellt. Dabei wird dem YouTube-Server mitgeteilt, welche unserer Seiten Sie besucht haben. Wenn Sie in Ihrem YouTube-Konto eingeloggt sind, ermöglichen Sie YouTube, Ihr Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen. Dies können Sie verhindern, indem Sie sich aus Ihrem YouTube-Konto ausloggen.
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2">
                  Die Nutzung von YouTube erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar. Sofern eine entsprechende Einwilligung eingeholt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2 break-words">
                  Weitere Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google:{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 break-all">
                    https://policies.google.com/privacy
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </p>
              </section>

              {/* 5. Ihre Rechte */}
              <section>
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <span className="text-blue-600 text-sm md:text-base">5.</span> Ihre Rechte
                </h2>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Im Rahmen der geltenden gesetzlichen Bestimmungen haben Sie jederzeit das Recht auf:
                </p>
                <ul className="list-disc pl-5 md:pl-6 mt-2 md:mt-3 space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
                  <li>Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung</li>
                  <li>Berichtigung oder Löschung dieser Daten</li>
                  <li>Einschränkung der Verarbeitung Ihrer personenbezogenen Daten</li>
                  <li>Datenübertragbarkeit der Daten, die wir aufgrund Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten</li>
                  <li>Widerruf Ihrer Einwilligung zur Datenverarbeitung mit Wirkung für die Zukunft</li>
                </ul>
                <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-4">
                  Für diese und weitere Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der in Abschnitt 2 angegebenen Adresse an uns wenden. Darüber hinaus haben Sie das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren.
                </p>
              </section>

              {/* Footer */}
              <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200 text-xs md:text-sm text-gray-500">
                <p>Stand: Januar 2026</p>
                <p className="mt-1 break-words">
                  Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter{' '}
                  <a href="mailto:fundgrube6@gmail.com" className="text-blue-600 hover:text-blue-700 break-all">
                    fundgrube6@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Back link - Mobile Optimized */}
          <div className="mt-4 md:mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors text-sm md:text-base"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPage;