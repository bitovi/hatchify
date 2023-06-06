import JSONAPISerializer from "json-api-serializer"

const Serializer = new JSONAPISerializer()

const deserialize = (data) => {
  if (data) {
    const { id } = data
    return { id }
  }
  return data
}

const buildPagingUrl = (urlParts, params, number) => {
  if (params.has("page[number]")) {
    params.set("page[number]", number)
  }

  return urlParts[0] + "?" + decodeURIComponent(params.toString())
}

// @TODO: fix paging for page > lastPage
const topLevelLinksfn = ({ page, pageSize, count, url }) => {
  url = url || ""
  if (page === undefined) return { self: url }
  const lastPage = Math.round(count / pageSize) - 1
  const hasPages = page < lastPage
  const isLastPage = page === lastPage
  const isFirstPage = page === 0
  const hasNextPage = count > pageSize * (page + 1) && !isLastPage
  const urlParts = url.split("?")
  const query = urlParts[1] || ""
  const params = new URLSearchParams(query)

  const linksObj = {
    self: url,
    first: !isFirstPage ? buildPagingUrl(urlParts, params, 0) : null,
    last:
      hasNextPage && !isLastPage
        ? buildPagingUrl(urlParts, params, lastPage)
        : null,
    next:
      hasPages && hasNextPage
        ? buildPagingUrl(urlParts, params, page + 1)
        : null,
    prev: !isFirstPage ? buildPagingUrl(urlParts, params, page - 1) : null,
  }
  Object.keys(linksObj).forEach(
    (key) => linksObj[key] == null && delete linksObj[key],
  )
  return linksObj
}

Serializer.register("employees", {
  id: "id",
  relationships: {
    roles: { type: "roles", deserialize },
    skills: { type: "skills", deserialize },
    assignments: { type: "assignments", deserialize },
  },
  topLevelLinks: topLevelLinksfn,
})

Serializer.register("roles", {
  id: "id",
  relationships: {
    assignments: { type: "assignments", deserialize },
    project: { type: "projects", deserialize },
    skills: { type: "skills", deserialize },
    employees: { type: "employees", deserialize },
  },
  topLevelLinks: topLevelLinksfn,
})

Serializer.register("skills", {
  id: "id",
  relationships: {
    roles: { type: "roles", deserialize },
    employees: { type: "employees", deserialize },
  },
  topLevelLinks: topLevelLinksfn,
})

Serializer.register("projects", {
  id: "id",
  relationships: {
    roles: { type: "roles", deserialize },
    assignments: { type: "assignments", deserialize },
  },
  topLevelLinks: topLevelLinksfn,
})

Serializer.register("assignments", {
  id: "id",
  relationships: {
    employee: { type: "employees", deserialize },
    role: { type: "roles", deserialize },
    projects: { type: "projects", deserialize },
  },
  topLevelLinks: topLevelLinksfn,
})

export default Serializer
