import React, { useContext, useEffect, useState } from 'react'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { getServerAuthSession } from 'trpc/auth'
import { getTRPCClientLive } from 'effects/trpcClient.live'
import { getEnvLive } from 'effects/env.list'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { err, ok, type Result } from 'libs/result'
import { Route } from 'modules/routes'
import { type Env } from 'effects/env'
import { type TRPCClient } from 'effects/trpcClient'
import { type User } from 'modules/user'
import { type ListPhoto } from 'trpc/routers/photos'
import { Time } from 'effects/time'
import { getTimeLive } from 'effects/time.live'
import { getTRPCServerLive } from 'effects/trpcClient.server.live'
import { getAPIClientLive } from 'effects/apiClient.live'
import { createBook, type Book } from 'modules/book'
import Trpc from 'pages/api/trpc/[trpc]'

export type BooksPageProps = {
  user: User | null
  books: Book[] | null
  baseURL: string
}

export async function getBooksPageProps(
  env: Env,
  trpcClient: TRPCClient,
  user: User | null,
): Promise<Result<BooksPageProps, Error>> {
  const baseURL = env.WEB_BASE_URL
  const books = (await trpcClient.book.list.query()).val
  return ok({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    books,
    baseURL,
  })
}

//USESTATE
// const [handleCreateBtn, setHandleCreateBtn] = useState(false);

//show allBook
export type BooksProps = {
  user: User | null
  books: Book[] | null
  trpcClient: TRPCClient
  time: Time
}

export function Books({
  user,
  books,
  trpcClient,
  time,
}: BooksProps): React.ReactElement | null {
  const listBooksQuery = useQuery({
    queryKey: ['listBooks'],
    queryFn: () => trpcClient.book.list.query(),
    initialData: books ? ok(books) : undefined,
  })
  return (
    <div>
      <div className="flex flex-row justify-between p-5">
        <div className="bg-blue-600">CRUD</div>
        <button className="bg-yellow-500">create</button>
      </div>
      <div className="space-y-4">
        <div className="space-y-4">
          <div>{listBooksQuery.isLoading && <span>Loading</span>}</div>
          <div className="flex flex-col">
            {listBooksQuery.data?.val &&
              listBooksQuery.data.val.map((e) => (
                <div key={e.id}>
                  <Book book={e} trpcClient={trpcClient} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

//inside pageBook
type BookProps = {
  book: Book
  trpcClient: TRPCClient
}

function Book(props: BookProps): JSX.Element {
  const queryClient = useQueryClient()
  const { book, trpcClient } = props
  const deleteTagMutation = useMutation(trpcClient.book.manage.delete.mutate, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['listBooks'])
    },
  })
  return (
    <div className="my-4 mx-auto w-96 space-y-3 rounded bg-white p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <span className="space-x-2 text-sm text-gray-500">
            <span className="font-bold text-gray-900">{book.author?.name}</span>
            <span>&middot;</span>
            <span>2 d</span>
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>
      <div className="aspect-square w-full rounded-md bg-gray-200">
        <h1 className="py-auto text-center">{book.title}</h1>
      </div>
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-between">
          <div className="m-5 flex flex-row items-center justify-between">
            <button className="bg flex flex-row items-center space-x-5 bg-yellow-400">
              Update
            </button>
          </div>
          <div>
            <button
              className="flex flex-row items-center space-x-5 bg-red-800"
              onClick={() => {
                deleteTagMutation.mutate({ bookId: book.id })
              }}
            >
              delete
            </button>
          </div>
        </div>
        <div className="text-gray-500">
          <p className="text-xs font-normal">{book.details}</p>
        </div>
      </div>
    </div>
  )
}

//Likebutton inside bookPages
function LikeButton(): React.ReactElement {
  return (
    <button className="rounded p-1 hover:bg-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}

//export allBook
const BooksPage: NextPage<BooksPageProps> = ({
  user,
  baseURL,
  books,
}): React.ReactElement | null => {
  const trpcClient = getTRPCClientLive(baseURL)
  const time = getTimeLive()
  return <Books user={user} books={books} trpcClient={trpcClient} time={time} />
}

export default BooksPage
