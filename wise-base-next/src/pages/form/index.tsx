import { getTRPCClientLive } from 'effects/trpcClient.live'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import { createBook, createBookScheme } from 'modules/book'
import type { NextApiRequest, NextApiResponse } from 'next'
import { useState } from 'react'
import { set, z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

export const initialValues: createBook = {
  title: '',
  numberPage: 0,
  details: '',
  category: [],
  author: {
    name: '',
    age: 0,
    retired: false,
  },
}
export default function Book() {
  const handleSubmit = async (values: createBook): Promise<void> => {
    console.log(values)
    const trpcClient = getTRPCClientLive(process.env.WEB_BASE_URL as string)
    await trpcClient.book.manage.create.mutate(values)
  }

  return (
    <div className="bg-gray-500">
      <Formik
        validationSchema={toFormikValidationSchema(createBookScheme)}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, dirty }) => (
          <Form>
            <div className="m-5 flex max-w-sm flex-col">
              <label htmlFor="">Create new Book</label>
              {/* title */}
              <ErrorMessage name="title" className="text-red-500" />
              <Field
                placeholder="title"
                className="text-black"
                name="title"
                type="text"
              />
              {/* numberpage */}
              <ErrorMessage name="numberPage" className="text-red-500" />
              <Field
                placeholder="numberPage"
                className="text-black"
                name="numberPage"
                type="number"
              />
              {/* details */}
              <ErrorMessage name="details" className="text-red-500" />
              <Field
                placeholder="details"
                className="text-black"
                name="details"
                type="text"
              />
              {/* category */}
              <ErrorMessage name="category" className="text-red-500" />
              <FieldArray name="category">
                {({ push, remove }) => (
                  <div>
                    {values.category.map((cat, index) => (
                      <div key={index}>
                        <Field name={`category[${index}]`} />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {push('')}}>
                      Add Category
                    </button>
                  </div>
                )}
              </FieldArray>
              {/* name */}
              <label htmlFor="">Author</label>
              <ErrorMessage name="author.name" className="text-red-500" />
              <Field
                placeholder="name"
                className="text-black"
                name="author.name"
                type="text"
              />
              {/* age */}
              <ErrorMessage name="author.age" className="text-red-500" />
              <Field
                placeholder="age"
                className="text-black"
                name="author.age"
                type="number"
              />
              {/* retired */}
              <ErrorMessage name="retired" className="text-red-500" />
              <Field
                type="checkbox"
                name="author.retired"
                className="text-black"
              />
              {/* button */}
              <button
                type="submit"
                className="border bg-green-500 p-1 disabled:bg-slate-500"
                disabled={!dirty}
              >
                sent it
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* <div className="text-gray-950 flex flex-col space-y-2">
        {title && <div>title : {title}</div>}
        {numberPage && <div>numberPage : {numberPage}</div>}
        {details && <div>details : {details}</div>}
        {category && <div>category : {category}</div>}
        {+name && <div>name : {name}</div>}
        {age && <div>Age : {age}</div>}
        {retired && <div>retired : {retired}</div>}
      </div> */}
    </div>
  )
}
