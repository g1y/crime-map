package main

import (
	"log"
	"os"
	"net/http"

	"github.com/minio/minio-go"
)

func main() {
	accessKey := os.Getenv("SPACES_KEY")
	secKey := os.Getenv("SPACES_SECRET")
	endpoint := "sfo2.digitaloceanspaces.com"
	spaceName := "crime-map" // Space names must be globally unique
	ssl := true

	// Initiate a client using DigitalOcean Spaces.
	client, err := minio.New(endpoint, accessKey, secKey, ssl)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Setting bucket to read only public")
	policy := `{"Version": "2012-10-17","Statement": [{"Action": ["s3:GetObject"],"Effect": "Allow","Principal": {"AWS": ["*"]},"Resource": ["arn:aws:s3:::crime-map/*"],"Sid": ""}]}`
	err = client.SetBucketPolicy(spaceName, policy)
	if err.Error() != "200 OK" {
		log.Fatalln("ERROR: " + err.Error())
		return
	}

	objectName := "bundle.js"
	filePath := "./dist/bundle.js"
	contentType := "application/javascript"
	n, err := client.FPutObject(spaceName, objectName, filePath, minio.PutObjectOptions{ContentType: contentType})
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("Successfully uploaded %s of size %d\n", objectName, n)
}
