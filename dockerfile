FROM hayd/alpine-deno

RUN deno install --allow-run --allow-read --allow-write --quiet --force --unstable https://deno.land/x/denon@2.4.5/denon.ts

USER deno

WORKDIR /src

EXPOSE 8080

ENTRYPOINT ["denon", "--config", "/src/support/scripts.json"]

CMD ["start"]