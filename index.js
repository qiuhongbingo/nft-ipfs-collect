const downloader = require('node-image-downloader')
const superagent = require('superagent')
const fs = require('fs')

const IPFS_URL = `https://opensea.mypinata.cloud/ipfs/${process.env.IPFS_ID}/`
const TOTAL = 10000

const collectById = async (id) => {
  try {
    const res = await superagent.get(`${IPFS_URL}${id}`).timeout(5000)

    const ipfs = JSON.stringify(res.body, null, 2)
    fs.writeFileSync(`./ipfs/${id}.json`, ipfs)

    const { name, image: uri } = res.body
    if (name) {
      console.log(name)
      await downloader({ imgs: [{ uri, filename: `${id}` }], dest: './nfts' })
      console.log(`${id}/${10000}`)
    } else {
      collectById(id)
    }
  } catch (error) {
    console.log(error)
    collectById(id)
  }
}

const collect = async () => {
  for (let id = 0; id < TOTAL; id++) {
    if (!fs.existsSync(`./nfts/${id}.png`)) {
      await collectById(id)
    }
  }
}

collect()
