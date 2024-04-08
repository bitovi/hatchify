import debounce from "lodash.debounce"
import { useEffect, useState } from "react"
import { getSchemaKey } from "@hatchifyjs/core"
import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

type ActiveSchema = keyof typeof Schemas | undefined

const jsonapi = createJsonapiClient("/api", Schemas)
const hatchedReact = hatchifyReact(jsonapi)
const hatchedReactRest = hatchifyReactRest(jsonapi)

const Navigation = hatchedReact.Navigation
const defaultSchema = getSchemaKey(Object.values(Schemas)[0]) as ActiveSchema

async function testNoNamespaces() {
  const { id: articleId } = await hatchedReactRest.Article.createOne({
    author: "John Doe",
    tag: "Hatchify",
  })

  const [articles] = await hatchedReactRest.Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articles.length === 1, `Found ${articles.length} articles`)

  const [article] = articles

  console.assert(article.author === "John Doe")
  console.assert(article.tag === "Hatchify")

  await hatchedReactRest.Article.updateOne({
    id: articleId,
    author: "John Doe Updated",
    tag: "Hatchify Updated",
  })

  const updatedArticle = await hatchedReactRest.Article.findOne(articleId)

  console.assert(updatedArticle?.author === "John Doe Updated")
  console.assert(updatedArticle?.tag === "Hatchify Updated")

  await hatchedReactRest.Article.deleteOne(articleId)

  const [articlesAfter] = await hatchedReactRest.Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articlesAfter.length === 0)
}

async function testNamepace() {
  const { id: articleId } = await hatchedReactRest.Feature_Article.createOne({
    author: "John Doe",
    tag: "Hatchify",
  })

  const [articles] = await hatchedReactRest.Feature_Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articles.length === 1, `Found ${articles.length} articles`)

  const [article] = articles

  console.assert(article.author === "John Doe")
  console.assert(article.tag === "Hatchify")

  await hatchedReactRest.Feature_Article.updateOne({
    id: articleId,
    author: "John Doe Updated",
    tag: "Hatchify Updated",
  })

  const updatedArticle =
    await hatchedReactRest.Feature_Article.findOne(articleId)

  console.assert(updatedArticle?.author === "John Doe Updated")
  console.assert(updatedArticle?.tag === "Hatchify Updated")

  await hatchedReactRest.Feature_Article.deleteOne(articleId)

  const [articlesAfter] = await hatchedReactRest.Feature_Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articlesAfter.length === 0)
}

async function testMultipleNamespaces() {
  const { id: userId } = await hatchedReactRest.Admin_User.createOne({
    name: "Juno",
  })

  const { id: articleId } = await hatchedReactRest.Feature_Article.createOne({
    author: "John Doe",
    tag: "Hatchify",
  })

  const [users] = await hatchedReactRest.Admin_User.findAll({
    filter: { id: { $eq: userId } },
  })

  console.assert(users.length === 1, `Found ${users.length} users`)

  const [user] = users

  console.assert(user.name === "Juno")

  const [articles] = await hatchedReactRest.Feature_Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articles.length === 1, `Found ${articles.length} articles`)

  const [article] = articles

  console.assert(article.author === "John Doe")
  console.assert(article.tag === "Hatchify")

  await hatchedReactRest.Admin_User.updateOne({
    id: userId,
    name: "Juno Updated",
    articles: [{ id: articleId }],
  })

  const updatedUser = await hatchedReactRest.Admin_User.findOne({
    id: userId,
    include: ["articles"],
  })

  console.assert(updatedUser?.id === userId)
  console.assert(updatedUser?.name === "Juno Updated")
  console.assert(updatedUser?.articles.length === 1)
  console.assert(updatedUser?.articles[0].author === "John Doe")
  console.assert(updatedUser?.articles[0].tag === "Hatchify")

  await hatchedReactRest.Feature_Article.updateOne({
    id: articleId,
    author: "John Doe Updated",
    tag: "Hatchify Updated",
    adminUser: {
      id: userId,
    },
  })

  const updatedArticle = await hatchedReactRest.Feature_Article.findOne({
    id: articleId,
    include: ["adminUser"],
  })

  console.assert(updatedArticle?.id === articleId)
  console.assert(updatedArticle?.author === "John Doe Updated")
  console.assert(updatedArticle?.tag === "Hatchify Updated")
  console.assert(updatedArticle?.adminUser.id === userId)
  console.assert(updatedArticle?.adminUser.name === "Juno Updated")

  await hatchedReactRest.Feature_Article.deleteOne(articleId)
  await hatchedReactRest.Admin_User.deleteOne(userId)

  const [usersAfter] = await hatchedReactRest.Admin_User.findAll({
    filter: { id: { $eq: userId } },
  })

  console.assert(usersAfter.length === 0)

  const [articlesAfter] = await hatchedReactRest.Feature_Article.findAll({
    filter: { id: { $eq: articleId } },
  })

  console.assert(articlesAfter.length === 0)
}

const debouncedTests = [
  testNoNamespaces,
  testNamepace,
  testMultipleNamespaces,
].map((func) => debounce(func, 100))

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<ActiveSchema>(defaultSchema)

  useEffect(() => {
    async function runTests() {
      for (const test of debouncedTests) {
        await test()
      }
    }
    runTests()
  }, [])

  const DataGrid = activeSchema
    ? hatchedReact.components[activeSchema].DataGrid
    : hatchedReact.NoSchemas

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Navigation
          activeTab={activeSchema}
          onTabChange={(tab) => setActiveSchema(tab as ActiveSchema)}
        />
        <DataGrid />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
