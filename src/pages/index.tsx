import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiGithub } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // eslint-disable-next-line consistent-return

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="./img/logo.png" alt="logo" />
      </div>
      <section className={styles.containerSection}>
        {postsPagination.results.map(post => (
          <a key={post.uid} href={`/post/${post.uid}`}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <time>
              <FiCalendar className={styles.icon} />
              15 mar 2021 <FiGithub className={styles.icon} />
              {post.data.author}
            </time>
          </a>
        ))}
      </section>
      <button type="button">
        {postsPagination.next_page ? 'Carregar Mais' : ''}
      </button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: [
        'post.title',
        'post.subtitle',
        'post.author',
        'post.content',
        'post.uid',
      ],
      pageSize: 20,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'data',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const page = postsResponse.next_page;

  return {
    props: {
      postsPagination: {
        next_page: page,
        results: posts,
      },
    },
  };
};
