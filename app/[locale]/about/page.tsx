/**
 * @component AboutPage
 * @description 关于我页面，参考设计稿重新设计
 * @author gouxinjie
 * @created 2025-06-01
 * @updated 2025-07-14
 */

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  MapPin,
  Mail,
  Briefcase,
  Download,
  Building2,
  Laptop,
  Rocket,
  BookOpen,
  Code2,
  Users,
  Lightbulb,
} from "lucide-react";
import { experiences, skills, values, type Experience, type Value } from "@/lib/data";
import FadeIn from "@/components/commons/FadeIn";
import ResumeButton from "@/components/commons/ResumeButton";
import styles from "./page.module.scss";

// 技能图标映射：使用 SVG 绘制品牌色块与缩写
const skillIcons: Record<string, JSX.Element> = {
  ts: (
    <svg viewBox="0 0 128 128" width="40" height="40">
      <rect width="100%" height="100%" rx="6" fill="#3178C6" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">TS</text>
    </svg>
  ),
  js: (
    <svg viewBox="0 0 128 128" width="40" height="40">
      <rect width="100%" height="100%" rx="6" fill="#F7DF1E" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="black" fontSize="16" fontWeight="bold">JS</text>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" width="40" height="40"><path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59 1.99-3.097 5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 00-1.102-.28zm0 1.367c.22 0 .397.05.553.143.68.393.978 1.89.746 3.805-.06.498-.156 1.017-.276 1.553a20.66 20.66 0 00-2.703-.463A21.07 21.07 0 0013.39 4.56c1.54-1.43 2.987-2.212 3.887-2.212zM9.21 2.68c-.9 0-2.35.78-3.888 2.213a20.93 20.93 0 00-1.81 2.11c-.85.19-1.67.42-2.45.688-.12-.53-.214-1.043-.276-1.535-.232-1.91.065-3.406.74-3.8.155-.096.338-.142.557-.142l.007-.034zm4.584.952c.385.48.77 1.002 1.153 1.557-.37-.018-.75-.03-1.136-.03-.39 0-.77.012-1.154.03.377-.55.767-1.073 1.137-1.557zm-3.967.902a19.73 19.73 0 011.878 2.256c-.61.035-1.218.088-1.82.162-.29.035-.574.075-.855.118a18.86 18.86 0 011.797-2.536zm5.198 3.208c.87.098 1.71.24 2.51.425a18.84 18.84 0 011.333 2.474 19.44 19.44 0 01-.872 2.52 19.62 19.62 0 01-2.512-.42 20.31 20.31 0 010-5zm-5.43.003a19.94 19.94 0 010 4.994 19.63 19.63 0 01-2.51-.418 18.83 18.83 0 01-1.333-2.474 19.64 19.64 0 01.872-2.52 19.62 19.62 0 012.97.418zm2.717.418c.5 0 1 .018 1.49.048.5.7.97 1.424 1.41 2.168-.437.74-.906 1.464-1.4 2.166-.49.03-.99.05-1.5.05s-1.01-.02-1.5-.05a19.92 19.92 0 01-1.4-2.165c.44-.744.91-1.47 1.41-2.168.49-.03.99-.047 1.49-.047zm-5.665 3.06c-.12.534-.217 1.053-.277 1.553-.232 1.914.065 3.41.74 3.8.157.097.34.145.56.145.9 0 2.348-.782 3.886-2.215a20.93 20.93 0 001.81-2.11c.85-.192 1.67-.417 2.45-.688.12.53.216 1.044.277 1.536.232 1.914-.065 3.41-.74 3.8-.155.097-.338.144-.557.144-1.346 0-3.107-.96-4.888-2.624-1.78 1.653-3.542 2.602-4.887 2.602-.41 0-.783-.09-1.106-.275-1.375-.793-1.683-3.264-.973-6.365C1.98 15.084 0 13.58 0 11.995c0-1.59 1.99-3.097 5.043-4.03z" fill="#61DAFB" /></svg>
  ),
  nextjs: (
    <svg viewBox="0 0 180 180" width="40" height="40"><mask id="about-next-mask" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180"><circle cx="90" cy="90" r="90" /></mask><g mask="url(#about-next-mask)"><circle cx="90" cy="90" r="90" /><path d="M149.508 158.265H30.9243V21.5352H149.508V158.265ZM122.176 134.068V104.6L108.058 120.447L93.8747 104.6V134.068H68.1576V45.7318H93.8747L108.058 61.5787L122.176 45.7318H147.893V134.068H122.176Z" fill="#fff" /></g></svg>
  ),
  nodejs: (
    <svg viewBox="0 0 128 128" width="40" height="40"><path d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.909 30.334C12.107 31.926 10.35 34.953 10.35 38.216v51.068c0 3.264 1.757 6.291 4.559 7.885l11.923 6.786c5.828 2.853 7.813 2.853 10.439 2.853 8.594 0 13.51-5.209 13.51-14.293V42.061c0-.695-.564-1.245-1.255-1.245H44.43c-.691 0-1.255.55-1.255 1.245v49.955c0 4.042-4.217 8.09-11.146 4.66l-12.317-7.116a1.59 1.59 0 01-.778-1.366V38.216c0-.562.301-1.084.778-1.366l44.119-25.583a1.593 1.593 0 011.557 0l44.098 25.582c.473.284.779.802.779 1.366v51.068c0 .563-.306 1.083-.779 1.366l-44.098 25.584a1.588 1.588 0 01-1.557 0l-11.706-6.763c-.416-.23-.97-.315-1.396-.131-3.263 1.463-3.876 1.653-6.928 2.5-.754.217-1.902.534.416 1.7l15.273 9.041c.817.474 1.732.717 2.672.717.963 0 1.895-.243 2.713-.717l44.097-25.583c2.802-1.596 4.56-4.618 4.56-7.885V38.216c0-3.263-1.758-6.287-4.56-7.882z" fill="#339933" /><path d="M82.123 81.974c-9.823 0-12.438-2.569-13.195-7.712-.09-.577-.573-1.006-1.163-1.006h-5.734c-.651 0-1.175.527-1.175 1.177 0 6.824 3.712 15.172 21.267 15.172 12.717 0 20.015-4.946 20.015-13.581 0-8.537-5.767-10.794-17.928-12.403-12.304-1.629-13.56-2.556-13.56-5.548 0-2.476 1.103-5.776 10.181-5.776 8.148 0 11.152 1.755 12.388 7.258.105.507.56.877 1.082.877h5.767c.328 0 .641-.141.86-.387a1.173 1.173 0 00.305-.898c-.808 9.647-8.517 12.688-20.402 12.688-11.642 0-18.56-4.383-18.56-11.999 0-8.174 5.636-10.37 15.6-11.979 12.07-1.944 13.016-2.727 13.016-5.528 0-3.818-3.068-5.434-10.29-5.434-9.034 0-11.012 3.23-11.654 7.644-.09.547-.563.948-1.12.948h-5.734c-.651 0-1.174-.525-1.174-1.176v.018c0 8.599 4.683 14.121 19.682 14.121z" fill="#339933" /></svg>
  ),
  vue: (
    <svg viewBox="0 0 128 128" width="40" height="40">
      <path d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" fill="#41B883" />
      <path d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" fill="#34495E" />
    </svg>
  ),
  go: (
    <svg viewBox="0 0 128 128" width="40" height="40">
      <rect width="100%" height="100%" rx="6" fill="#00ADD8" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Go</text>
    </svg>
  ),
  tailwind: (
    <svg viewBox="0 0 24 24" width="40" height="40"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4" /></svg>
  ),
  postgresql: (
    <svg viewBox="0 0 24 24" width="40" height="40"><path d="M17.128 0a10.134 10.134 0 00-2.755.403l-.063.02A10.922 10.922 0 0012.6.258C11.425.088 10.525 0 10.025 0c-.16 0-.306.008-.438.022-.675.075-1.367.3-2.05.7-.682.398-1.35.95-1.992 1.647-.642.698-1.248 1.532-1.805 2.488-.557.956-1.054 2.027-1.479 3.196-.424 1.169-.77 2.428-1.03 3.756-.26 1.328-.39 2.718-.39 4.148 0 1.43.132 2.798.396 4.095.264 1.297.65 2.513 1.15 3.63.5 1.117 1.108 2.128 1.816 3.017.708.889 1.51 1.65 2.397 2.27.887.62 1.855 1.098 2.896 1.424 1.041.326 2.16.49 3.348.49.6 0 1.19-.044 1.764-.132.574-.088 1.125-.22 1.648-.395.523-.175 1.016-.395 1.472-.66.456-.264.872-.575 1.242-.931.37-.356.698-.757.978-1.2.28-.443.51-.93.688-1.455.178-.525.266-1.09.266-1.69 0-.6-.09-1.168-.27-1.7-.18-.532-.44-1.022-.78-1.466-.34-.444-.75-.834-1.226-1.166a6.9 6.9 0 00-1.596-.814 7.856 7.856 0 00-1.89-.395c-.664-.066-1.36-.05-2.084.048a9.124 9.124 0 00-2.16.595c-.712.295-1.374.695-1.98 1.194-.606.5-1.148 1.095-1.62 1.78-.472.685-.866 1.448-1.178 2.282-.312.834-.536 1.732-.668 2.686-.132.954-.148 1.956-.048 3 .1 1.044.312 2.068.632 3.064.32.996.742 1.948 1.26 2.844.518.896 1.126 1.728 1.816 2.486.69.758 1.456 1.436 2.29 2.024.834.588 1.736 1.082 2.698 1.474.962.392 1.978.588 3.04.588.532 0 1.048-.04 1.544-.12.496-.08.972-.2 1.424-.36.452-.16.878-.36 1.274-.6.396-.24.76-.52 1.09-.84.33-.32.624-.68.88-1.08.256-.4.466-.84.628-1.32.162-.48.244-.996.244-1.548 0-.552-.082-1.068-.244-1.548-.162-.48-.372-.92-.628-1.32-.256-.4-.55-.76-.88-1.08-.33-.32-.694-.6-1.09-.84a5.6 5.6 0 00-1.274-.6 6.84 6.84 0 00-1.424-.36 7.4 7.4 0 00-1.544-.12c-1.062 0-2.078.196-3.04.588-.962.392-1.864.886-2.698 1.474-.834.588-1.6 1.266-2.29 2.024-.69.758-1.298 1.59-1.816 2.486-.518.896-.94 1.848-1.26 2.844-.32.996-.532 2.02-.632 3.064-.1 1.044-.084 2.046.048 3 .132.954.356 1.852.668 2.686.312.834.706 1.597 1.178 2.282.472.685 1.014 1.28 1.62 1.78.606.499 1.268.9 1.98 1.194a9.124 9.124 0 002.16.595c.724.098 1.42.114 2.084.048a7.856 7.856 0 001.89-.395 6.9 6.9 0 001.596-.814c.476-.332.886-.722 1.226-1.166.34-.444.6-.934.78-1.466.18-.532.27-1.1.27-1.7 0-.6-.088-1.165-.266-1.69-.178-.525-.408-1.012-.688-1.455-.28-.443-.608-.844-.978-1.2-.37-.356-.786-.667-1.242-.931-.456-.265-.949-.485-1.472-.66-.523-.175-1.074-.307-1.648-.395a9.9 9.9 0 00-1.764-.132c-1.188 0-2.307.164-3.348.49-1.041.326-2.01.804-2.896 1.424-.887.62-1.689 1.381-2.397 2.27-.708.889-1.316 1.9-1.816 3.017-.5 1.117-.886 2.333-1.15 3.63-.264 1.297-.396 2.665-.396 4.095 0 1.43.13 2.82.39 4.148.26 1.328.606 2.587 1.03 3.756.425 1.169.922 2.24 1.479 3.196.557.956 1.163 1.79 1.805 2.488.642.697 1.31 1.249 1.992 1.647.683.4 1.375.625 2.05.7.132.014.278.022.438.022.5 0 1.4-.088 2.575-.258.872-.123 1.724-.317 2.543-.58l.063-.02A10.134 10.134 0 0017.128 0z" fill="#336791"/></svg>
  ),
};

// 经历图标映射
const experienceIcons: Record<string, JSX.Element> = {
  building: <Building2 size={20} />,
  laptop: <Laptop size={20} />,
  rocket: <Rocket size={20} />,
};

// 价值观图标映射
const valueIcons: Record<string, JSX.Element> = {
  "book-open": <BookOpen size={24} />,
  "code-2": <Code2 size={24} />,
  users: <Users size={24} />,
  lightbulb: <Lightbulb size={24} />,
};

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = useTranslations("About");

  return (
    <div className={styles.about}>
      {/* Hero 区域：左侧文字 + 右侧图片 */}
      <section className={styles.hero}>
        <div className="container-custom">
          <div className={styles.hero__grid}>
            <FadeIn>
              <div className={styles.hero__content}>
                <span className={styles.hero__label}>{t("label")}</span>
                <h1 className={styles.hero__title}>{t("title")}</h1>
                <p className={styles.hero__desc}>{t("description")}</p>
                <div className={styles.hero__info}>
                  <span className={styles.hero__info__item}>
                    <MapPin size={16} />
                    {t("location")}
                  </span>
                  <span className={styles.hero__info__item}>
                    <Mail size={16} />
                    {t("email")}
                  </span>
                  <span className={styles.hero__info__item}>
                    <Briefcase size={16} />
                    {t("experience_years")}
                  </span>
                </div>
                <ResumeButton className={styles.hero__resume}>
                  <Download size={16} />
                  {t("download_resume")}
                </ResumeButton>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className={styles.hero__image}>
                <img
                  src="/images/about-bg-1.png"
                  alt={locale === "zh" ? "工作桌面" : "Work desk"}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 技术栈区域 */}
      <section className={styles.section} id="skills">
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("skills_title")}</h2>
          </FadeIn>
          <div className={styles.skillGrid}>
            {skills.map((skill, idx) => (
              <FadeIn key={skill.name} delay={0.05 * idx}>
                <div className={styles.skillCard}>
                  <div className={styles.skillCard__icon}>
                    {skillIcons[skill.icon] || (
                      <span className={styles.skillCard__fallback}>{skill.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <span className={styles.skillCard__name}>{skill.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 工作经历区域 */}
      <section className={styles.section}>
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("experience_title")}</h2>
          </FadeIn>
          <div className={styles.experienceList}>
            {experiences.map((exp: Experience, idx: number) => (
              <FadeIn key={exp.id} delay={0.1 * idx}>
                <div className={styles.expCard}>
                  <div className={styles.expCard__date}>{exp.period}</div>
                  <div className={styles.expCard__main}>
                    <div className={styles.expCard__icon}>{experienceIcons[exp.icon] || <Building2 size={20} />}</div>
                    <div className={styles.expCard__content}>
                      <h3 className={styles.expCard__role}>
                        {locale === "zh" ? exp.role : exp.roleEn}
                        <span className={styles.expCard__divider}>·</span>
                        <span className={styles.expCard__company}>{locale === "zh" ? exp.company : exp.companyEn}</span>
                      </h3>
                      <p className={styles.expCard__desc}>
                        {locale === "zh" ? exp.description : exp.descriptionEn}
                      </p>
                      <div className={styles.expCard__tags}>
                        {exp.tags.map((tag) => (
                          <span key={tag} className={styles.expCard__tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 价值观区域 */}
      <section className={styles.section}>
        <div className="container-custom">
          <div className={styles.valuesGrid}>
            {values.map((value: Value, idx: number) => (
              <FadeIn key={value.id} delay={0.1 * idx}>
                <div className={styles.valueCard}>
                  <div className={styles.valueCard__icon}>{valueIcons[value.icon] || <Lightbulb size={24} />}</div>
                  <h3 className={styles.valueCard__title}>{locale === "zh" ? value.title : value.titleEn}</h3>
                  <p className={styles.valueCard__desc}>{locale === "zh" ? value.description : value.descriptionEn}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
