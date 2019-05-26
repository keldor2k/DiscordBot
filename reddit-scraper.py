import praw
import csv
reddit = praw.Reddit(client_id='',
                     client_secret='',
                     user_agent='')

with open('imageLinks.csv','w') as csvFile:
    fieldnames = ['title', 'url']
    for post in reddit.subreddit('AnimeGirls').top('all', limit=300):
        if (not post.over_18 and post.score > 20 and ('imgur.com' in post.url
        or 'i.redd.it' in post.url
        or 'redditmedia.com' in post.url
        or 'gfycat.com' in post.url)):
            try:
                csvFile.write(post.title + ', ' + post.url + '\n')
            except UnicodeEncodeError:
                pass
            #print(vars(post))
