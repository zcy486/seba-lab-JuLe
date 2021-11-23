FROM python:3

WORKDIR /jule-backend

ENV FLASK_APP=app

ENV FLASK_ENV=development

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["flask", "run"]