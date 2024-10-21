import { Album } from "../models/Album"
import SearchResults from "../models/SearchResults"
import { Track } from "../models/Track"
import errorResponse from "../util/errorResponse"
import response from "../util/response"

export default function searchRoutes(app, client) {
  app.get("/search", async (req, res) => {
    const q = req.query.q
    const type = req.query.type
    let typeArray

    if (!q) {
      res
        .status(400)
        .send(errorResponse(new Error("No search query provided!")))
      return
    }
    if (type) {
      typeArray = [...type.toString().split(",")]
    }
    try {
      const searchResponse = await client.search(q.toString(), typeArray)
      const body = await searchResponse.json()

      let tracks: Array<Track>
      let albums: Array<Album>

      tracks = body?.tracks?.items
        ? body.tracks.items.map((track) => {
            return new Track(
              track?.name,
              track?.artists[0].name,
              track?.album?.name,
              track?.duration_ms ? track.duration_ms / 1000 : 0,
              track?.album?.images[0]?.url,
              track?.album?.id,
              track?.id
            )
          })
        : []

      albums = body?.albums?.items
        ? body.albums.items.map((album) => {
            return new Album(
              album?.name,
              album?.artists[0]?.name,
              album?.images[0]?.url,
              album?.id
            )
          })
        : []
      console.log("200 - /search        - Query: " + q)
      res.send(response(undefined, new SearchResults(tracks, albums)))
    } catch (e) {
      console.error(e)
      res.status(500).send(errorResponse(e))
    }
  })
}