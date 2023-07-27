FROM python:3.10

WORKDIR /srv

COPY . /srv

RUN --mount=type=cache,target=/root/.cache \
    pip install -e .

RUN python init.py

CMD python run.py