package main

import (
    "log"
    "os"

    "github.com/minio/minio-go"
)

func main() {
    accessKey := os.Getenv("SPACES_KEY")
    secKey := os.Getenv("SPACES_SECRET")
    endpoint := "nyc3.digitaloceanspaces.com"
    spaceName := "crime-map" // Space names must be globally unique
    ssl := true

    // Initiate a client using DigitalOcean Spaces.
    client, err := minio.New(endpoint, accessKey, secKey, ssl)
    if err != nil {
        log.Fatal(err)
    }

    objectName := "dist/"
    filePath := "./dist"
    contentType := "application/javascript"
    n, err := client.FPutObject(spaceName, objectName, filePath, minio.PutObjectOptions{ContentType:contentType})
    if err != nil {
        log.Fatalln(err)
    }

    log.Printf("Successfully uploaded %s of size %d\n", objectName, n)
}
