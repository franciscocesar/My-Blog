import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img src=".././img/logo.png" alt="teste" />
      </div>
    </header>
  );
}
